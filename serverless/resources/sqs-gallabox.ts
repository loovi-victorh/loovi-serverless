import type { AWS } from "@serverless/typescript";
import type { QueueAttributeName } from "@aws-sdk/client-sqs";

type Resource = Pick<AWS, "resources">["resources"];

const Properties: Partial<Record<QueueAttributeName, string>> = {
  MessageRetentionPeriod: "345600",
  DelaySeconds: "${param:SQS_DELAY_SECONDS}",
  VisibilityTimeout: "1200",
};

export const sqsResource: Resource = {
  Resources: {
    QuotationGallaboxQueue: {
      Type: "AWS::SQS::Queue",
      Properties: {
        QueueName: "quotation-gallabox-queue-${opt:stage, 'dev'}",
        ...Properties,
        RedrivePolicy: {
          deadLetterTargetArn: {
            "Fn::GetAtt": ["QuotationGallaboxDLQQueue", "Arn"],
          },
          maxReceiveCount: "3",
        },
      },
    },
  },
};

const PropertiesDLQ: Partial<Record<QueueAttributeName, string>> = {
  MessageRetentionPeriod: "345600",
  VisibilityTimeout: "1200",
};

export const sqsDlqResource: Resource = {
  Resources: {
    QuotationGallaboxDLQQueue: {
      Type: "AWS::SQS::Queue",
      Properties: {
        QueueName: "quotation-gallabox-dlq-${opt:stage, 'dev'}",
        ...PropertiesDLQ,
      },
    },
  },
};
