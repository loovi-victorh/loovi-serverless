import { SQSBatchItemFailure, SQSEvent } from "aws-lambda";
import { SegmentEvent } from "../providers/segment/segment";

export async function run(event: SQSEvent, context: any) {
  console.log("Full event to test", JSON.stringify(event));

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
  }
}
