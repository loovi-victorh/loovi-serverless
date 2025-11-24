import { SQSBatchItemFailure, SQSEvent } from "aws-lambda";
import Redis from "ioredis";
import { Gallabox } from "../process-quotations-gallabox/gallabox";
import { processPlan } from "../process-quotations-gallabox/process-plan";
import { appendLeadToGoogleSheets } from "../process-quotations-gallabox/sheets";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";
import { Sap } from "../providers/sap/sap";

const redis = new Redis.Cluster(
  [
    {
      host: process.env.REDIS_HOST!,
      port: 6379,
    },
  ],
  {
    lazyConnect: true,
    dnsLookup: (address, callback) => callback(null, address),
    redisOptions: {
      password: process.env.REDIS_PASSWORD,
      username: "admin",
      tls: {},
    },
  }
);

export async function run(event: SQSEvent, context: any) {
  let logBuffer = "";
  const log = (message: string) => {
    logBuffer += `[${process.env.STAGE}] ` + message + "\n";
  };

  const supabase = createClient<Database>(
    `${process.env.PRD_SUPABASE_PROJECT_URL}`,
    process.env.PRD_SUPABASE_KEY!
  );

  const segmentBatch: {
    type: "track";
    userId: string;
    event: "lia_assign_sales_team" | "lia_assign_sales_team_failed";
    properties: {
      phone: string;
      conversation_id: string;
    };
    timestamp: string;
  }[] = [];

  const sapApiUrl = process.env.SAP_API_URL;
  const sapProxyApiUrl = process.env.SAP_PROXY_API_URL;
  const sapApiKey = process.env.SAP_API_KEY;
  const redisHost = process.env.REDIS_HOST;
  const redisPassword = process.env.REDIS_PASSWORD;
  const gallaboxApiKey = process.env.GALLABOX_API_KEY;
  const gallaboxApiSecret = process.env.GALLABOX_API_SECRET;
  const gallaboxAccountId = process.env.GALLABOX_ACCOUNT_ID;
  const gallaboxSalesTeamId = process.env.GALLABOX_SALES_TEAM_ID;
  const supabaseProjectUrl = process.env.PRD_SUPABASE_PROJECT_URL;
  const supabaseKey = process.env.PRD_SUPABASE_KEY;

  if (
    !sapApiUrl ||
    !sapProxyApiUrl ||
    !sapApiKey ||
    !redisHost ||
    !redisPassword ||
    !gallaboxApiKey ||
    !gallaboxApiSecret ||
    !gallaboxAccountId ||
    !gallaboxSalesTeamId ||
    !supabaseProjectUrl ||
    !supabaseKey
  ) {
    return {
      ok: false,
      error:
        "Missing SAP_API_URL, SAP_PROXY_API_URL or SAP_API_KEY or REDIS_HOST or REDIS_PASSWORD or GALLABOX_API_KEY or GALLABOX_API_SECRET or GALLABOX_ACCOUNT_ID or GALLABOX_SALES_TEAM_ID or PRD_SUPABASE_PROJECT_URL or PRD_SUPABASE_KEY",
    };
  }

  const createdAtLte = new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString();

  log("Created at lte: " + createdAtLte);

  const { data: distributions, error } = await supabase
    .from("distribution")
    .select("*")
    .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
    .eq("opt_out", false)
    .or("attendant.is.null,attendant.eq.ia");

  if (error) {
    console.error("Error getting distribution", error);
    return {
      ok: false,
      error: "Error getting distribution",
    };
  }
  log(`Found ${distributions?.length} distributions`);

  // Second verification

  const { data: allRecoveryUsers, error: recoveryUsersError } = await supabase
    .from("agents_recovery_verification")
    .select("*")
    .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
    .lte("last_message_at", createdAtLte);

  if (recoveryUsersError) {
    console.error("Error getting recovery users", recoveryUsersError);
    return {
      ok: false,
      error: "Error getting recovery users",
    };
  }

  const recoveryUsers = allRecoveryUsers.filter((r) => !!r.conversation_id);
  log(`Found ${recoveryUsers?.length} recovery users`);

  async function hashSha1(t: string) {
    const msgUint8 = new TextEncoder().encode(t); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""); // convert bytes to hex string
    return hashHex;
  }

  const list = new Map<
    string,
    {
      phone: string;
      conversationId: string;
      createdAt: string;
      lastMessageAt?: string;
    }
  >();

  for (const usr of distributions) {
    if (usr.gallabox_last_conversation_id) {
      list.set(usr.phone_br, {
        phone: usr.phone_br,
        conversationId: usr.gallabox_last_conversation_id || "",
        createdAt: usr.created_at,
        lastMessageAt: undefined,
      });
    } else {
      log(`No conversation id for ${usr.phone_br}`);
    }
  }

  for (const usr of recoveryUsers) {
    if (!usr.conversation_id) {
      try {
        const { data, error } = await supabase
          .from("distribution")
          .select("*")
          .eq("phone_br", usr.phone_br)
          .single();

        if (error) {
          console.error("Error getting data for", usr.phone_br, error);
          continue;
        }

        if (data && data.gallabox_last_conversation_id) {
          list.set(usr.phone_br, {
            phone: usr.phone_br,
            conversationId: data.gallabox_last_conversation_id || "",
            createdAt: data.created_at,
            lastMessageAt: usr.last_message_at,
          });
          continue;
        } else {
          log(`No conversation id for ${usr.phone_br}`);
        }
      } catch (error) {
        console.error("Error getting data for", usr.phone_br, error);
        continue;
      }
    } else {
      // conversation id exists
      list.set(usr.phone_br, {
        phone: usr.phone_br,
        conversationId: usr.conversation_id,
        createdAt: usr.created_at,
        lastMessageAt: usr.last_message_at,
      });
    }
  }

  log(`List size: ${list.size}`);

  async function checkUser({
    phone,
    conversationId,
    createdAt,
    lastMessageAt,
  }: {
    phone: string;
    conversationId: string;
    createdAt: string;
    lastMessageAt?: string;
  }) {
    logBuffer = "";
    log(
      `[${process.env.STAGE}] [INFO] processing dist - phone: ${phone}, conversationId: ${conversationId}, createdAt: ${createdAt}, lastMessageAt: ${lastMessageAt}`
    );

    const redisRespondedKey = `gallabox:conversation-responded:${phone}`;

    let shouldTransferToTeam = false;

    const check =
      process.env.STAGE === "prd" ? await redis.get(redisRespondedKey) : "";
    if (check === "true" && !lastMessageAt) {
      log(`${phone} - Conversation already responded`);
      console.log(logBuffer);
      return false;
    } else {
      log(`Conversation id: ${conversationId}`);

      if (
        conversationId &&
        typeof conversationId === "string" &&
        conversationId.length > 0
      ) {
        shouldTransferToTeam = true;
      }
    }

    if (lastMessageAt) {
      // difference in hours from now to last message at
      const now = new Date();
      const lastMessageAtDate = new Date(lastMessageAt);
      const diffInHours =
        Math.abs(now.getTime() - lastMessageAtDate.getTime()) /
        (1000 * 60 * 60);
      log(`Last message at: ${lastMessageAt}, diff in hours: ${diffInHours}`);
      shouldTransferToTeam = true;
    }

    if (shouldTransferToTeam) {
      log(
        `Transferring to team - phone: ${phone}, conversationId: ${conversationId}`
      );
      const gallabox = new Gallabox();

      const sap = new Sap();
      const telefone = phone.replace(/^55/, "");

      const quotation = await sap.getLastQuotation(phone);
      const quotationId = quotation?.idCotacao;

      log(
        `User found - phone: ${phone}, telefone: ${telefone}, quotationId: ${quotationId}`
      );
      if (quotationId) {
        log(`User has quotation id: ${quotationId}`);

        /**
         * Cotação já foi finalizada, não fazer nada
         */
        if (quotation.status !== "Venda em aberto") {
          log(`Quotation status not open: ${quotation.status}`);

          console.log(logBuffer);
          return false;
        }
        const userId = await hashSha1(quotation.email);

        const plan = processPlan(quotation);

        if (process.env.STAGE === "prd") {
          const result = await gallabox.assignConversationToTeam({
            phone,
            conversationId,
          });

          try {
            /**
             * Enviar para o Google Sheets
             */
            if (process.env.STAGE === "prd") {
              await appendLeadToGoogleSheets({
                name: quotation.nomeCliente,
                email: quotation.email,
                phone,
                cpf: quotation.cpf,
                plan,
                coupon: quotation.idCampanha,
                fee: quotation.valorAdesao,
                priceWithoutDiscount: quotation.valorSemDesconto,
                totalPrice: quotation.valorTotal,
                discount: quotation.descontos,
                sellerId: quotation.vendedor,
                quotationId: quotation.idCotacao,
                userId: userId || "",
                userCode: quotation.codigoCliente,
                createdAt: createdAt,
                recoveryWhatsappSent: true,
                assignedToSalesTeam: !!result,
              });
            }
            log("Would append lead to Google Sheets");
          } catch (error) {
            console.error("Error appending lead to Google Sheets", error);
          }

          if (result) {
            segmentBatch.push({
              type: "track",
              userId: userId,
              event: "lia_assign_sales_team",
              properties: {
                conversation_id: conversationId,
                phone,
              },
              timestamp: createdAt,
            });

            log(
              `${phone} - Conversation assigned to sales team: ${conversationId}`
            );
          } else {
            segmentBatch.push({
              type: "track",
              userId: userId,
              event: "lia_assign_sales_team_failed",
              properties: {
                conversation_id: conversationId,
                phone,
              },
              timestamp: createdAt,
            });

            log(
              `${phone} - Failed to assign conversation to sales team: ${conversationId}`
            );
          }
        } else {
          log(
            `[${process.env.STAGE}] Would assign conversation to sales team - phone: ${phone}, conversationId: ${conversationId}`
          );
        }
      }
      console.log(logBuffer);
      return true;
    } else {
      log(`Not transferring to team: ${phone}`);
      console.log(logBuffer);
      return false;
    }
  }

  console.log(logBuffer);

  for (const [phone, { conversationId, createdAt, lastMessageAt }] of list) {
    try {
      console.log(`${process.env.STAGE} - Checking user: ${phone}`);
      await checkUser({ phone, conversationId, createdAt, lastMessageAt });
    } catch (error) {
      console.error("Error checking user", phone, error);
      continue;
    }
  }

  const segmentApiUrl = "https://api.segment.io/v1";
  const segmentApiKey = process.env.SEGMENT_API_KEY;

  if (segmentApiKey && segmentBatch.length > 0) {
    if (process.env.STAGE === "prd") {
      const segmentHeaders = new Headers();
      segmentHeaders.append("Content-Type", "application/json");
      await fetch(`${segmentApiUrl}/batch`, {
        headers: segmentHeaders,
        method: "POST",
        body: JSON.stringify({
          batch: segmentBatch,
          writeKey: segmentApiKey,
        }),
      });
    }

    log(`Would send to Segment: ${segmentBatch.length}`);
  } else {
    log(`Would not send to Segment: ${segmentBatch.length}`);
  }

  return {
    success: true,
  };
}
