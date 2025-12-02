import type { AWS } from "@serverless/typescript";
import type { QueueAttributeName } from "@aws-sdk/client-sqs";

type Resource = Pick<AWS, "resources">["resources"];

const Properties: Partial<Record<QueueAttributeName, string>> = {
  MessageRetentionPeriod: "345600",
  DelaySeconds: "60",
  VisibilityTimeout: "1200",
};

export const sqsLiaFailedQuotationRetry: Resource = {
  Resources: {
    LiaFailedQuotationRetryQueue: {
      Type: "AWS::SQS::Queue",
      Properties: {
        QueueName: "lia-failed-quotation-retry-queue-${opt:stage, 'dev'}",
        ...Properties,
      },
    },
  },
};

const PropertiesDLQ: Partial<Record<QueueAttributeName, string>> = {
  MessageRetentionPeriod: "345600",
  VisibilityTimeout: "1200",
};

export const sqsRetryQuotationDlqResource: Resource = {
  Resources: {
    LiaFailedQuotationRetryQueueDLQ: {
      Type: "AWS::SQS::Queue",
      Properties: {
        QueueName: "lia-failed-quotation-retry-queue-dlq-${opt:stage, 'dev'}",
        ...PropertiesDLQ,
      },
    },
  },
};
