import type { AWS } from "@serverless/typescript";
import type { QueueAttributeName } from "@aws-sdk/client-sqs";

type Resource = Pick<AWS, "resources">["resources"];

const Properties: Partial<Record<QueueAttributeName, string>> = {
  MessageRetentionPeriod: "345600",
  DelaySeconds: "20",
  VisibilityTimeout: "1200",
};

export const sqsPurchasedResource: Resource = {
  Resources: {
    PurchasedGallaboxQueue: {
      Type: "AWS::SQS::Queue",
      Properties: {
        QueueName: "purchased-gallabox-queue-${opt:stage, 'dev'}",
        ...Properties,
      },
    },
  },
};
