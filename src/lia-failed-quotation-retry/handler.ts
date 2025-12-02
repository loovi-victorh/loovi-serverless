import { SQSBatchItemFailure, SQSEvent } from "aws-lambda";
import { SegmentEvent } from "../providers/segment/segment";
import Redis from "ioredis";

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

export async function run(event: SQSEvent, context: any) {
  console.log("Full event to test", JSON.stringify(event));
  const batchItemFailures: SQSBatchItemFailure[] = [];

  const segmentBatch: {
    type: "track";
    anonymousId: string;
    event: "quotation_retry_success" | "quotation_retry_failed";
    properties: {
      phone: string;
      [key: string]: any;
    };
    timestamp: string;
  }[] = [];

  for (const evt of event.Records) {
    const ev = JSON.parse(evt.body) as SegmentEvent;

    if (ev.detail.type === "track") {
      if (ev.detail.event === "generate_quotation_error") {
        const phone = ev.detail.properties.phone;

        if (!phone) {
          console.error(
            "no phone present at generate_quotation_error",
            JSON.stringify(ev.detail, null, 2)
          );
          continue;
        }

        const concurrencyCheckKey = `${process.env.STAGE || "dev"}-failed-quotation-retry:${phone}`;
        const lockTtlSeconds = 60;
        const lockResult = await redis.set(
          concurrencyCheckKey,
          "true",
          "EX",
          lockTtlSeconds,
          "NX"
        );

        if (lockResult !== "OK") {
          console.error(
            "concurrency avoided for phone",
            ev.detail.properties.phone
          );
          continue;
        }

        try {
          console.log("ok");
          const { error_status, error_url, error } = ev.detail.properties;

          const payload = {
            error_status,
            error_url,
            error,
          };

          const headers = new Headers();
          headers.append(
            "x-api-key",
            process.env.STAGE === "prd"
              ? process.env.PRD_MASTRA_API_KEY!
              : process.env.MASTRA_API_KEY!
          );
          headers.append("content-type", "application/json");

          const res = await fetch(
            `${process.env.MASTRA_API_URL}/api-c/retry-quotation/${phone}`,
            {
              method: "POST",
              headers,
              body: JSON.stringify(payload),
            }
          );

          if (!res.ok) {
            batchItemFailures.push({
              itemIdentifier: ev.id,
            });
            console.error(
              "error retrying quotation for phone",
              phone,
              "status",
              res.status
            );
            let errorMessage = "unknown";
            try {
              const errorData = await res.json();
              if (errorData.error) {
                errorMessage = errorData.error;
              }
            } catch (error) {
              console.error("failed to parse json from error");
            }
            segmentBatch.push({
              type: "track",
              anonymousId: ev.detail.anonymousId || crypto.randomUUID(),
              event: "quotation_retry_failed",
              properties: {
                phone: phone.toString(),
                status: res.status,
                error: errorMessage,
              },
              timestamp: new Date().toISOString(),
            });
            continue;
          }

          const result = (await res.json()) as {
            result?: "success";
            awaiting_ai_response?: any;
            quotation?: {
              quotationId: string;
            };
          };

          segmentBatch.push({
            type: "track",
            anonymousId: ev.detail.anonymousId || crypto.randomUUID(),
            event: "quotation_retry_success",
            properties: {
              phone: phone.toString(),
              status: res.status,
              quotation_id: result.quotation?.quotationId,
              awaiting_ai_response:
                typeof result.awaiting_ai_response !== "undefined"
                  ? true
                  : false,
            },
            timestamp: new Date().toISOString(),
          });

          console.log("retry quotation success", phone);
        } catch (error) {
          console.error("error", error);
          continue;
        } finally {
          await redis.del(concurrencyCheckKey);
        }
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

      console.log(`Would send to Segment: ${segmentBatch.length}`);
    } else {
      console.log(`Would not send to Segment: ${segmentBatch.length}`);
    }

    console.log("Event received", ev.detail.type, ev.detail.event);
  }

  return {
    batchItemFailures,
  };
}
