import { SQSBatchItemFailure, SQSEvent } from "aws-lambda";
import Redis from "ioredis";
import fetch from "node-fetch";
import { processPlan } from "./process-plan";
import { checkExecutive } from "./check-executive";
import { Gallabox } from "./gallabox";
import { formatBrazilianPhone } from "../utils/format-phone";
import { appendLeadToGoogleSheets } from "./sheets";
import { SegmentEvent } from "../providers/segment/segment";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";

export interface SAPQuotation {
  codigoCliente: string;
  cpf: string;
  descontos: number;
  email: string;
  idCotacao: string;
  idPlano: string;
  idCampanha: string;
  nomeCliente: string;
  vendedor: number;
  status: "Venda em aberto" | string;
  statusProposta: "Nova" | string;
  telefone: string;
  valorAdesao: number;
  valorFrete: number;
  valorProposta: number;
  valorSemDesconto: number;
  valorTotal: number;
  itensCotacao: {
    codigoItem: string;
    descricao: string;
  }[];
}

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

type Distribution = {
  phone_gallabox: string;
  phone_br: string;
  opt_out: boolean;
  attendant: string;
  gallabox_contact_id: string;
  gallabox_channel_id: string;
  gallabox_last_conversation_id: string;
  gallabox_team_id: string;
  gallabox_assignee_id: string;
} | null;

export async function run(event: SQSEvent, context: any) {
  console.log("Full event to test", JSON.stringify(event));
  const batchItemFailures: SQSBatchItemFailure[] = [];

  const sapApiUrl = process.env.SAP_API_URL;
  const sapProxyApiUrl = process.env.SAP_PROXY_API_URL;
  const sapApiKey = process.env.SAP_API_KEY;
  const redisHost = process.env.REDIS_HOST;
  const redisPassword = process.env.REDIS_PASSWORD;
  const gallaboxWebhookUrl = process.env.GALLABOX_WEBHOOK_URL;
  const gallaboxIaWebhookUrl = process.env.GALLABOX_IA_WEBHOOK_URL!;
  const gallaboxApiKey = process.env.GALLABOX_API_KEY;
  const gallaboxApiSecret = process.env.GALLABOX_API_SECRET;
  const gallaboxAccountId = process.env.GALLABOX_ACCOUNT_ID;

  if (
    !sapApiUrl ||
    !sapProxyApiUrl ||
    !sapApiKey ||
    !redisHost ||
    !redisPassword ||
    !gallaboxWebhookUrl ||
    !gallaboxApiKey ||
    !gallaboxApiSecret ||
    !gallaboxAccountId ||
    !gallaboxIaWebhookUrl
  ) {
    return {
      ok: false,
      error:
        "Missing SAP_API_URL, SAP_PROXY_API_URL or SAP_API_KEY or REDIS_HOST or REDIS_PASSWORD or GALLABOX_WEBHOOK_URL or GALLABOX_API_KEY or GALLABOX_API_SECRET or GALLABOX_ACCOUNT_ID or GALLABOX_IA_WEBHOOK_URL",
    };
  }

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("X-Api-Key", sapApiKey);

  const segmentBatch: {
    type: "track";
    userId: string;
    event: "cart_recovery_sent" | "cart_recovery_sent_ia";
    properties: {
      quotation_id: string;
      plan: string;
      phone: string;
      template: string;
    };
    timestamp: string;
  }[] = [];

  for (const evt of event.Records) {
    const ev = JSON.parse(evt.body) as SegmentEvent;

    console.log("Event received", ev.detail.type, ev.detail.event);

    if (ev.detail.type === "track") {
      if (ev.detail.event === "quotation_generated") {
        const proxyRequest = {
          url: sapApiUrl,
          metodo: "GET",
          headers: {
            requester: "Portal",
            cotacao: ev.detail.properties.quotation_id,
          },
          body: {},
        };

        const base64ProxyReq = Buffer.from(
          JSON.stringify(proxyRequest)
        ).toString("base64");

        /**
         * Busca por cotação no SAP
         */
        console.time("SAP time");
        const sapResponse = await fetch(sapProxyApiUrl, {
          headers,
          method: "POST",
          body: base64ProxyReq,
        });
        console.timeEnd("SAP time");

        if (!sapResponse.ok) {
          console.error(
            "Error SAP",
            sapResponse.status,
            "quotation_generated",
            ev.detail.properties.quotation_id
          );
          batchItemFailures.push({ itemIdentifier: evt.messageId });
          continue;
        }

        const quotationWithDoubleQuotes = (await sapResponse.json()) as string;
        const quotationInBase64 = quotationWithDoubleQuotes.replace(/"/g, "");

        const quotationJson = Buffer.from(quotationInBase64, "base64").toString(
          "utf-8"
        );

        const quotation = JSON.parse(quotationJson) as SAPQuotation;

        /**
         * Cotação já foi finalizada, não fazer nada
         */
        if (quotation.status !== "Venda em aberto") {
          console.log("Quotation status not open", quotation.status);
          continue;
        }

        if (
          Number(quotation.vendedor) !== 19 &&
          Number(quotation.vendedor) !== 0
        ) {
          console.log("Skipping executive");
          continue;
        }

        const isExecutive = await checkExecutive(ev.detail.userId || "a");

        if (isExecutive) {
          console.log("Skipping executive (Segment had_executive_quotation)");
          continue;
        }

        const redisKey = `${process.env.STAGE || "dev"}-${quotation.telefone}`;
        const quotationId = !process.env.LOCAL
          ? await redis.get(redisKey)
          : undefined;

        const plan = processPlan(quotation);

        const blockGallabox = false;
        // format: 55 + DDD + 9NNNNNNNN
        const phone = formatBrazilianPhone(quotation.telefone);

        /**
         * Já enviamos Whatsapp nos últimos 7 dias, não enviar novamente
         */
        if (quotationId) {
          console.log("Skipping - already sent in the last 7 days");

          if (process.env.STAGE === "prd") {
            continue;
          } else {
            console.log("not skipping in dev");
          }
        }

        const distributionResponse = await fetch(
          `https://n8n.loovi.com.br/webhook/get-distribution-from-supabase`,
          {
            method: "POST",
            body: JSON.stringify({
              phone_br: phone,
            }),
          }
        );

        let dist: Distribution = null;
        if (distributionResponse.ok) {
          try {
            const data = (await distributionResponse.json()) as Distribution;
            dist = data;
          } catch (error) {
            console.info("supabase empty");
          }
        }

        const gallabox = new Gallabox();

        if (dist?.attendant === "ia") {
          console.log("Skipping - already attributed to IA");
          continue;
        } else if (dist?.attendant === "inside" && dist?.gallabox_assignee_id) {
          console.log(
            "Skipping and mentioning contact - already attributed to team member",
            dist.gallabox_assignee_id
          );
          await gallabox.mentionTeamMember(phone, dist.gallabox_assignee_id);
          continue;
        } else if (
          dist?.attendant === "inside" &&
          !dist?.gallabox_assignee_id
        ) {
          console.log("Skipping - attendant inside but no assignee id");
          continue;
        }

        let sendToIa = true;

        // send to IA if saturday or sunday
        const dayOfWeek = new Date().getDay();

        if (dayOfWeek === 0) {
          console.log("Stopping team assignment - outside sunday:", dayOfWeek);
          sendToIa = true;
        } else {
          // const team = await gallabox.getTeam();
          // const availableTeam = gallabox.filterAvailableTeamMembers(team);

          // const teamSize = availableTeam.length + 1;

          // based on the size of the team (including AI), send to IA 1/teamSize of the time
          // sendToIa = Math.random() < 1 / teamSize;
          sendToIa = true;
        }

        if (process.env.STAGE !== "prd") {
          console.log("Sending to IA in dev");
          sendToIa = true;
        }

        let gallaboxSent = false;
        // const rand = Math.random();
        // 50% chance
        // const template = rand < 0.5 ? "default" : "marketing";
        // const template = "marketing";
        const template = "default";

        if (!blockGallabox) {
          const gallaboxHeaders = new Headers();
          gallaboxHeaders.append("Content-Type", "application/json");

          /**
           * Envia para Gallabox
           */

          // sendToIa = false;

          const webhookUrl = sendToIa
            ? gallaboxIaWebhookUrl
            : gallaboxWebhookUrl;

          console.time("Gallabox time");
          const gallaboxResp = await fetch(webhookUrl, {
            method: "POST",
            headers: gallaboxHeaders,
            body: JSON.stringify({
              quotationId: quotation.idCotacao,
              userId: ev.detail.userId,
              userCode: quotation.codigoCliente,
              phone,
              name: quotation.nomeCliente.split(" ")[0],
              fee: quotation.valorAdesao,
              priceWithoutDiscount: quotation.valorSemDesconto,
              totalPrice: quotation.valorTotal,
              discount: quotation.descontos,
              sellerId: quotation.vendedor,
              cpf: quotation.cpf,
              email: quotation.email,
              plan,
              coupon: quotation.idCampanha.replace(/(_[A-Z]{2})$/, ""),
              orderId: `checkout/${quotation.idCotacao}`,
              template: template,
            }),
          });
          console.timeEnd("Gallabox time");
          if (!gallaboxResp.ok) {
            console.error(
              "Error sending Gallabox webhook",
              gallaboxResp.status,
              "quotation_generated",
              ev.detail.properties.quotation_id
            );
            console.log("Gallabox webhook response", await gallaboxResp.json());

            batchItemFailures.push({ itemIdentifier: evt.messageId });
          } else {
            gallaboxSent = true;

            /**
             * Salva no Redis para não enviar novamente nos próximos 7 dias
             */
            if (!process.env.LOCAL) {
              await redis.set(
                redisKey,
                ev.detail.properties.quotation_id.toString() || "-"
              );
              await redis.expire(redisKey, 60 * 60 * 24 * 7);
            }

            const conversationVerificationKey = `gallabox:conversation-verify:${phone}`;

            await redis.set(conversationVerificationKey, "true");
            await redis.expire(conversationVerificationKey, 60 * 60 * 24);

            if (ev.detail.userId) {
              segmentBatch.push({
                type: "track",
                userId: ev.detail.userId,
                event: sendToIa
                  ? "cart_recovery_sent_ia"
                  : "cart_recovery_sent",
                properties: {
                  quotation_id: ev.detail.properties.quotation_id.toString(),
                  plan,
                  phone,
                  template: sendToIa ? template : "inside-default",
                },
                timestamp: ev.time,
              });
              console.log(
                "Gallabox webhook sent for quotation",
                ev.detail.properties.quotation_id,
                "sent to",
                sendToIa ? "IA" : "inside",
                "template",
                template
              );
              console.log(
                "Gallabox webhook response",
                await gallaboxResp.json()
              );
            }
          }
        }

        // try {
        /**
         * Enviar para o Google Sheets
         */
        // await appendLeadToGoogleSheets({
        //   name: quotation.nomeCliente,
        //   email: quotation.email,
        //   phone,
        //   cpf: quotation.cpf,
        //   plan,
        //   coupon: quotation.idCampanha,
        //   fee: quotation.valorAdesao,
        //   priceWithoutDiscount: quotation.valorSemDesconto,
        //   totalPrice: quotation.valorTotal,
        //   discount: quotation.descontos,
        //   sellerId: sendToIa ? "IA" : quotation.vendedor,
        //   quotationId: quotation.idCotacao,
        //   userId: ev.detail.userId || "",
        //   userCode: quotation.codigoCliente,
        //   createdAt: ev.time,
        //   recoveryWhatsappSent: gallaboxSent,
        // });
        // } catch (error) {
        //   console.error("Error appending lead to Google Sheets", error);
        // }

        console.log(
          "Webhook sent for quotation",
          ev.detail.properties.quotation_id
        );
      }
    }
  }

  const segmentApiUrl = "https://api.segment.io/v1";
  const segmentApiKey = process.env.SEGMENT_API_KEY;

  if (segmentApiKey && segmentBatch.length > 0) {
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

  return {
    batchItemFailures,
  };
}
