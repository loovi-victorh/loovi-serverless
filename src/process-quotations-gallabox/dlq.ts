import { SQSEvent } from "aws-lambda";
import { SegmentEvent } from "./handler";

// Dead Letter Queue
export async function run(event: SQSEvent, context: any) {
  console.log("Full event to test", JSON.stringify(event));

  const segmentUrl = "https://api.segment.io/v1";
  const segmentApiKey = process.env.SEGMENT_API_KEY;

  if (!segmentUrl || !segmentApiKey) {
    return {
      success: false,
      error: "Missing SEGMENT_API_KEY",
    };
  }

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  for (const evt of event.Records) {
    const ev = JSON.parse(evt.body) as SegmentEvent;

    if (!ev.detail.userId) continue;

    console.log("Event received", ev.detail.type, ev.detail.event);

    await fetch(`${segmentUrl}/track`, {
      headers,
      method: "POST",
      body: JSON.stringify({
        writeKey: segmentApiKey,
        event: "dlq_quotation_recovery_error",
        userId: ev.detail.userId,
        properties: {
          quotation_id: ev.detail.properties.quotation_id,
        },
      }),
    });
  }

  return {
    success: true,
  };
}
