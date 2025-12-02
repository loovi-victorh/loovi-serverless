import { EventBridgeEvent } from "aws-lambda";
import { drizzle } from "drizzle-orm/node-postgres";
import Redis from "ioredis";
import fs from "fs";
import path from "path";
import { leadsBlackfriday2025EmailDistinct } from "../../drizzle/schema";
import {
  CreateTemplateCommand,
  GetTemplateCommand,
  GetTemplateCommandOutput,
  SendBulkTemplatedEmailCommand,
  TemplateDoesNotExistException,
} from "@aws-sdk/client-ses";
import { sesClient } from "../providers/aws-ses/client";

const redis =
  process.env.ENVIRONMENT === "local"
    ? new Redis(process.env.REDIS_LOCAL!)
    : new Redis.Cluster(
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
const certPath = path.resolve(process.cwd(), "us-east-1-bundle.pem");
const caCert = fs.readFileSync(certPath, "utf-8");

const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
    ssl: {
      ca: caCert,
      rejectUnauthorized: false,
    },
  },
});

type Lead = {
  name: string;
  email: string;
  quotationId: string;
  monthYear: string;
};

type PerDayLimit = {
  count: number;
  date: string;
};

export async function run(
  event: EventBridgeEvent<"Scheduled Event", any>,
  context: any
) {
  console.log("Full event to test", JSON.stringify(event));

  if (process.env.STAGE !== "prd") {
    return { message: "skipping test environments" };
  }

  const perDayLimitKey = "loovi-bf-2025-email-perday";
  const perDayLimitString = await redis.get(perDayLimitKey);
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const todayIso = new Date(todayStart).toISOString();
  let perDayLimit: PerDayLimit;

  if (perDayLimitString) {
    perDayLimit = JSON.parse(perDayLimitString) as PerDayLimit;
  } else {
    perDayLimit = { count: 0, date: todayIso };
    await redis.set(perDayLimitKey, JSON.stringify(perDayLimit));
  }

  const storedDay = perDayLimit.date
    ? new Date(perDayLimit.date).setHours(0, 0, 0, 0)
    : undefined;

  if (!storedDay || storedDay !== todayStart) {
    perDayLimit = { count: 0, date: todayIso };
    await redis.set(perDayLimitKey, JSON.stringify(perDayLimit));
  }

  const dailyCap = 500_000;
  const remainingDailyCapacity = Math.max(dailyCap - perDayLimit.count, 0);

  if (remainingDailyCapacity === 0) {
    return { message: "daily limit reached" };
  }

  try {
    const TEMPLATE_NAME = "loovi-bf-2025-black500-3";
    const subj =
      "Último lote Black Loovi: 50% OFF no seu Seguro + Adesão por R$1,00!";
    const SUBJECT =
      process.env.ENVIRONMENT === "local" ? `[TESTE] ${subj}` : subj;

    const templatePath = path.resolve(
      process.cwd(),
      "src/blackfriday-2025-email-mkt",
      "index.html"
    );
    const htmlFile = fs.readFileSync(templatePath, "utf-8");

    let template: GetTemplateCommandOutput | undefined = undefined;

    try {
      template = await sesClient.send(
        new GetTemplateCommand({ TemplateName: TEMPLATE_NAME })
      );
      console.log("template found", template);
    } catch (error) {
      console.error("error getting template", error);

      if (error instanceof TemplateDoesNotExistException) {
        console.warn("template does not exist, creating instead");

        const createTemplateCommand = new CreateTemplateCommand({
          /**
           * The template feature in Amazon SES is based on the Handlebars template system.
           */
          Template: {
            /**
             * The name of an existing template in Amazon SES.
             */
            TemplateName: TEMPLATE_NAME,
            HtmlPart: htmlFile,
            SubjectPart: "{{subject}}",
          },
        });

        await sesClient.send(createTemplateCommand);

        template = await sesClient.send(
          new GetTemplateCommand({ TemplateName: TEMPLATE_NAME })
        );
      } else {
        throw error;
      }
    }

    const countKey = "loovi-bf-2025-email-count";
    const countString = await redis.get(countKey);

    const concurrencyCheckKey = "loovi-bf-2025-email-executing";
    const lockTtlSeconds = 6 * 60;
    const lockResult = await redis.set(
      concurrencyCheckKey,
      "true",
      "EX",
      lockTtlSeconds,
      "NX"
    );

    if (lockResult !== "OK") {
      console.error("concurrency avoided");
      return { error: "concurrency avoided" };
    }

    try {
      let count = 0;

      if (countString) {
        count = Number(countString);
      }

      const perBatch = 5 * 60; // 5 min -> 300 seg
      const limit = Math.min(perBatch * 300, remainingDailyCapacity); // 300/seg in 300seg

      const users = (await db
        .select()
        .from(leadsBlackfriday2025EmailDistinct as any)
        .limit(limit)
        .offset(count)) as Lead[];

      if (users.length === 0) {
        console.log("no more leads to send");
        return { success: true };
      }

      console.log("starting at", count);
      console.log("subject", SUBJECT);
      console.log("retrieved", users.length, "leads");

      const chunks = Math.ceil(users.length / perBatch);
      console.log(chunks, "of ", perBatch, "size");

      let chunksSent = 0;
      let successes = 0;
      const sesMaxBatch = 50;

      for (let i = 0; i < users.length; i += perBatch) {
        const chunk = users.slice(i, i + perBatch);
        chunksSent++;
        console.log("sending chunk", chunksSent, "of", chunks);

        for (let j = 0; j < chunk.length; j += sesMaxBatch) {
          const sesBatch = chunk.slice(j, j + sesMaxBatch);

          const sendBulk = new SendBulkTemplatedEmailCommand({
            Destinations: sesBatch.map((user) => ({
              Destination: { ToAddresses: [user.email] },
              ReplacementTemplateData: JSON.stringify({
                name: user.name,
                url: `https://loovi.com.br/cotacao/proposta/${user.quotationId}`,
                subject: SUBJECT,
                unsubscribe: `https://email-mkt.loovi.com.br/gerenciar-email/${user.email}`,
              }),
            })),
            DefaultTemplateData: JSON.stringify({
              name: "cliente",
              url: "#",
              subject: SUBJECT,
              unsubscribe: "https://loovi.com.br",
            }),
            Source: "Loovi Seguros <noreply@loovi.com.br>",
            Template: TEMPLATE_NAME,
          });

          const emailsSent = await sesClient.send(sendBulk);
          const sentCount = emailsSent.Status?.length || 0;

          count += sentCount;
          successes +=
            emailsSent.Status?.filter((s) => s.Status === "Success").length || 0;
          await redis.set(countKey, count.toString());
          console.log("set count to (next offset)", count);
          console.log("emails sent length", sentCount);

          perDayLimit.count = Math.min(dailyCap, perDayLimit.count + sentCount);
          await redis.set(perDayLimitKey, JSON.stringify(perDayLimit));
        }

        // console.log("waiting 1s");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const segmentApiUrl = "https://api.segment.io/v1";
      const segmentApiKey = process.env.SEGMENT_API_KEY;

      if (segmentApiKey && successes > 0) {
        const segmentHeaders = new Headers();
        segmentHeaders.append("Content-Type", "application/json");

        await fetch(`${segmentApiUrl}/track`, {
          headers: segmentHeaders,
          method: "POST",
          body: JSON.stringify({
            anonymousId: crypto.randomUUID(),
            event: "email_mkt_sent",
            properties: {
              template: TEMPLATE_NAME,
              subject: SUBJECT,
              quantity: limit,
              successes: successes,
            },
            writeKey: segmentApiKey,
          }),
        });
      }

      return { success: true };
    } finally {
      await redis.del(concurrencyCheckKey);
    }
  } catch (error) {
    console.error("unknown error", error);

    return { success: false };
  }
}
