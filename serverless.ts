import type { AWS } from "@serverless/typescript";
import {
  sqsDlqResource,
  sqsResource,
} from "./serverless/resources/sqs-gallabox";
import {
  sqsLiaFailedQuotationRetry,
  sqsRetryQuotationDlqResource,
} from "./serverless/resources/sqs-lia-failed-quotation-retry";
// import { sqsPurchasedResource } from "./serverless/resources/sqs-gallabox-purchased";
// serverless.ts

const serverlessConfiguration: AWS = {
  service: "loovi-serverless",
  provider: {
    name: "aws",
    runtime: "nodejs22.x",
    profile: "loovi-sso",
    timeout: 60,
    memorySize: 512,
    region: "us-east-2",
    stage: "${opt:stage, 'dev'}",
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["s3:*"],
            Resource: [
              "arn:aws:s3:::${self:provider.environment.BUCKET_NAME}/*",
            ],
          },
          {
            Effect: "Allow",
            Action: ["ses:*"],
            Resource: ["*"],
          },
          {
            Effect: "Allow",
            Action: ["events:*"],
            Resource: ["*"],
          },
          {
            Effect: "Allow",
            Action: ["secretsmanager:*"],
            Resource: [
              "arn:aws:secretsmanager:us-east-2:366146806243:secret:lia-serverless-keys-LhFeiA",
            ],
          },
        ],
      },
    },
    environment: {
      BUCKET_NAME: "${param:BUCKET_NAME}",
      stage: "${opt:stage, 'dev'}",
    },
  },
  custom: {
    ssmKeys: "${ssm:/aws/reference/secretsmanager/lia-serverless-keys}",
  },
  stages: {
    default: {
      params: {
        STAGE: "${opt:stage, 'dev'}",
        BUCKET_NAME: "loovi-serverless-dev-bucket",
        SAP_PROXY_API_URL:
          "https://6syrq1gkul.execute-api.us-east-2.amazonaws.com/staging/proxy/SAP",
        SAP_API_URL:
          "https://sapiis.loovi.com.br:50000/cotacao/Api/v1/obterDadosCotacao",
        SAP_API_KEY: "${self:custom.ssmKeys.SAP_API_KEY}",
        SAP_PRD_API_KEY: "${self:custom.ssmKeys.SAP_PRD_API_KEY}",
        SQS_DELAY_SECONDS: "20",
        SQS_CHECK_RESPONSE_DELAY_SECONDS: "40",
        CHECK_RESPONSE_SCHEDULE: "rate(365 days)",
        GALLABOX_WEBHOOK_URL:
          "https://server.gallabox.com/accounts/67af9a1e292376becc59c4ce/integrations/genericWebhook/67f58b4bf1db6ba0b795991c/webhook",
        GALLABOX_API_KEY: "67fe697efe88a376967a7f95",
        GALLABOX_API_SECRET: "${self:custom.ssmKeys.GALLABOX_API_SECRET}",
        GALLABOX_ACCOUNT_ID: "67af9a1e292376becc59c4ce",
        GALLABOX_IA_WEBHOOK_URL:
          "https://server.gallabox.com/accounts/67af9a1e292376becc59c4ce/integrations/genericWebhook/6859c4ef285a35b28d9544f9/webhook",
        GALLABOX_SALES_TEAM_ID: "67f68ce612933abf5b2869ee",
        GALLABOX_API_URL:
          "https://server.gallabox.com/devapi/accounts/67af9a1e292376becc59c4ce",
        MASTRA_API_URL: "https://l-ia-hml.loovi.com.br",
      },
    },
    dev: {
      params: {
        STAGE: "${opt:stage, 'dev'}",
        BUCKET_NAME: "loovi-serverless-dev-bucket",
        SAP_PROXY_API_URL:
          "https://6syrq1gkul.execute-api.us-east-2.amazonaws.com/staging/proxy/SAP",
        SAP_API_URL:
          "https://sapiis.loovi.com.br:50000/cotacao/Api/v1/obterDadosCotacao",
        SAP_API_KEY: "${self:custom.ssmKeys.SAP_API_KEY}",
        SAP_PRD_API_KEY: "${self:custom.ssmKeys.SAP_PRD_API_KEY}",
        SQS_DELAY_SECONDS: "20",
        SQS_CHECK_RESPONSE_DELAY_SECONDS: "40",
        CHECK_RESPONSE_SCHEDULE: "rate(365 days)",
        GALLABOX_WEBHOOK_URL:
          "https://server.gallabox.com/accounts/67af9a1e292376becc59c4ce/integrations/genericWebhook/67f58b4bf1db6ba0b795991c/webhook",
        GALLABOX_API_KEY: "67fe697efe88a376967a7f95",
        GALLABOX_API_SECRET: "${self:custom.ssmKeys.GALLABOX_API_SECRET}",
        GALLABOX_ACCOUNT_ID: "67af9a1e292376becc59c4ce",
        GALLABOX_IA_WEBHOOK_URL:
          "https://server.gallabox.com/accounts/67af9a1e292376becc59c4ce/integrations/genericWebhook/6859c4ef285a35b28d9544f9/webhook",
        GALLABOX_SALES_TEAM_ID: "67f68ce612933abf5b2869ee",
        GALLABOX_API_URL:
          "https://server.gallabox.com/devapi/accounts/67af9a1e292376becc59c4ce",
        MASTRA_API_URL: "https://l-ia-hml.loovi.com.br",
      },
    },
    prd: {
      params: {
        STAGE: "${opt:stage, 'dev'}",
        BUCKET_NAME: "loovi-serverless-prd-bucket",
        SAP_PROXY_API_URL:
          "https://ticjxjby64.execute-api.us-east-1.amazonaws.com/producao/proxy/v2/SAP",
        SAP_API_URL:
          "https://sapiis.loovi.com.br:60000/cotacao/Api/v1/obterDadosCotacao",
        SAP_API_KEY: "${self:custom.ssmKeys.SAP_PRD_API_KEY}",
        SAP_PRD_API_KEY: "${self:custom.ssmKeys.SAP_PRD_API_KEY}",
        SQS_DELAY_SECONDS: "600",
        SQS_CHECK_RESPONSE_DELAY_SECONDS: "10800",
        CHECK_RESPONSE_SCHEDULE: "rate(10 minutes)",
        GALLABOX_WEBHOOK_URL:
          "https://server.gallabox.com/accounts/67af9a1e292376becc59c4ce/integrations/genericWebhook/67f6df58c6f6556a7c6b1d83/webhook",
        GALLABOX_API_KEY: "67fe697efe88a376967a7f95",
        GALLABOX_API_SECRET: "${self:custom.ssmKeys.GALLABOX_API_SECRET}",
        GALLABOX_ACCOUNT_ID: "67af9a1e292376becc59c4ce",
        GALLABOX_IA_WEBHOOK_URL:
          "https://server.gallabox.com/accounts/67af9a1e292376becc59c4ce/integrations/genericWebhook/6859b9c74727e73104bbe7b8/webhook",
        GALLABOX_SALES_TEAM_ID: "67f68ce612933abf5b2869ee",
        GALLABOX_API_URL:
          "https://server.gallabox.com/devapi/accounts/67af9a1e292376becc59c4ce",
        MASTRA_API_URL: "https://l-ia-prd.loovi.com.br",
      },
    },
  },
  functions: {
    processQuotationsForGallaboxDLQ: {
      name: "loovi-serverless-${opt:stage, 'dev'}-process-quotations-for-gallabox-dlq",
      handler: "src/process-quotations-gallabox/dlq.run",
      timeout: 600,
      events: [
        {
          sqs: {
            arn: {
              "Fn::GetAtt": ["QuotationGallaboxDLQQueue", "Arn"],
            },
          },
        },
      ],
      environment: {
        SEGMENT_API_KEY: "QcF3GovxQGxp4JpsOOCOLdPe46r0KN7F",
        STAGE: "${param:STAGE}",
      },
      vpc: {
        securityGroupIds: ["sg-01ad57ca651860605"],
        subnetIds: [
          "subnet-0f432cb7e59af46e4",
          "subnet-0df6b7728aaa08f25",
          "subnet-0f606c435bdb5507e",
        ],
      },
    },
    processQuotationsForGallabox: {
      name: "loovi-serverless-${opt:stage, 'dev'}-process-quotations-for-gallabox",
      handler: "src/process-quotations-gallabox/handler.run",
      timeout: 600,
      events: [
        {
          // schedule: "rate(5 minutes)",
          sqs: {
            arn: {
              "Fn::GetAtt": ["QuotationGallaboxQueue", "Arn"],
            },
            batchSize: 10,
            functionResponseType: "ReportBatchItemFailures",
            maximumBatchingWindow: 60,
          },
        },
      ],
      environment: {
        STAGE: "${param:STAGE}",
        SEGMENT_API_KEY: "Pl9v46WKj22ZBusq2ClVDnHfqAG3lpdu",
        SAP_PROXY_API_URL: "${param:SAP_PROXY_API_URL}",
        SAP_API_URL: "${param:SAP_API_URL}",
        SAP_API_KEY: "${param:SAP_API_KEY}",
        GALLABOX_WEBHOOK_URL: "${param:GALLABOX_WEBHOOK_URL}",
        GALLABOX_API_KEY: "${param:GALLABOX_API_KEY}",
        GALLABOX_API_SECRET: "${param:GALLABOX_API_SECRET}",
        GALLABOX_ACCOUNT_ID: "${param:GALLABOX_ACCOUNT_ID}",
        GALLABOX_IA_WEBHOOK_URL: "${param:GALLABOX_IA_WEBHOOK_URL}",
        GALLABOX_SALES_TEAM_ID: "${param:GALLABOX_SALES_TEAM_ID}",
        GALLABOX_API_URL: "${param:GALLABOX_API_URL}",
        REDIS_HOST: "n8n-mem-cache-xlaonl.serverless.use2.cache.amazonaws.com",
        REDIS_PASSWORD: "${self:custom.ssmKeys.REDIS_PASSWORD}",
        GOOGLE_SHEETS_CLIENT_EMAIL:
          "loovi-serverless@loovi-marketing.iam.gserviceaccount.com",
        GOOGLE_SHEETS_PRIVATE_KEY: "${self:custom.ssmKeys.GOOGLE_PRIVATE_KEY}",
        GOOGLE_SHEETS_SPREADSHEET_ID:
          "11glJv5Zvw_Jw39IfVCkoNPTIPs2LrnOwJ7x0iyPT_2k",
        SEGMENT_PROFILES_SPACE_ID: "spa_inowBQWcvZ7qigHHcYfFqD",
        SEGMENT_PROFILES_API_KEY:
          "${self:custom.ssmKeys.SEGMENT_PROFILES_API_KEY}",
      },
      vpc: {
        securityGroupIds: ["sg-01ad57ca651860605"],
        subnetIds: [
          "subnet-0f432cb7e59af46e4",
          "subnet-0df6b7728aaa08f25",
          "subnet-0f606c435bdb5507e",
        ],
      },
    },
    processCheckResponseForGallabox: {
      name: "loovi-serverless-${opt:stage, 'dev'}-process-check-response-gallabox",
      handler: "src/process-check-response-gallabox/handler.run",
      timeout: 600,
      events: [
        {
          schedule: "${param:CHECK_RESPONSE_SCHEDULE}",
        },
      ],
      environment: {
        STAGE: "${param:STAGE}",
        SEGMENT_API_KEY: "Pl9v46WKj22ZBusq2ClVDnHfqAG3lpdu",
        SAP_PROXY_API_URL: "${param:SAP_PROXY_API_URL}",
        SAP_API_URL: "${param:SAP_API_URL}",
        SAP_PRD_API_KEY: "${param:SAP_PRD_API_KEY}",
        SAP_API_KEY: "${param:SAP_API_KEY}",
        GALLABOX_API_KEY: "${param:GALLABOX_API_KEY}",
        GALLABOX_API_SECRET: "${param:GALLABOX_API_SECRET}",
        GALLABOX_ACCOUNT_ID: "${param:GALLABOX_ACCOUNT_ID}",
        GALLABOX_SALES_TEAM_ID: "${param:GALLABOX_SALES_TEAM_ID}",
        GALLABOX_API_URL: "${param:GALLABOX_API_URL}",
        REDIS_HOST: "n8n-mem-cache-xlaonl.serverless.use2.cache.amazonaws.com",
        REDIS_PASSWORD: "${self:custom.ssmKeys.REDIS_PASSWORD}",
        PRD_SUPABASE_PROJECT_URL: "https://cibgvzosquflnscharso.supabase.co",
        PRD_SUPABASE_KEY: "${self:custom.ssmKeys.PRD_SUPABASE_KEY}",
        GOOGLE_SHEETS_CLIENT_EMAIL:
          "loovi-serverless@loovi-marketing.iam.gserviceaccount.com",
        GOOGLE_SHEETS_PRIVATE_KEY: "${self:custom.ssmKeys.GOOGLE_PRIVATE_KEY}",
        GOOGLE_SHEETS_SPREADSHEET_ID:
          "11glJv5Zvw_Jw39IfVCkoNPTIPs2LrnOwJ7x0iyPT_2k",
      },
      vpc: {
        securityGroupIds: ["sg-01ad57ca651860605"],
        subnetIds: [
          "subnet-0f432cb7e59af46e4",
          "subnet-0df6b7728aaa08f25",
          "subnet-0f606c435bdb5507e",
        ],
      },
    },
    sqsLiaFailedQuotationRetry: {
      name: "loovi-serverless-${opt:stage, 'dev'}-lia-failed-quotation-retry-queue",
      handler: "src/lia-failed-quotation-retry/handler.run",
      timeout: 400,
      events: [
        {
          sqs: {
            arn: {
              "Fn::GetAtt": ["LiaFailedQuotationRetryQueue", "Arn"],
            },
            batchSize: 5,
            functionResponseType: "ReportBatchItemFailures",
            maximumBatchingWindow: 60,
          },
        },
      ],
      environment: {
        STAGE: "${param:STAGE}",
        SEGMENT_API_KEY: "Pl9v46WKj22ZBusq2ClVDnHfqAG3lpdu",
        SAP_PROXY_API_URL: "${param:SAP_PROXY_API_URL}",
        SAP_API_URL: "${param:SAP_API_URL}",
        SAP_PRD_API_KEY: "${param:SAP_PRD_API_KEY}",
        SAP_API_KEY: "${param:SAP_API_KEY}",
        GALLABOX_API_KEY: "${param:GALLABOX_API_KEY}",
        GALLABOX_API_SECRET: "${param:GALLABOX_API_SECRET}",
        GALLABOX_ACCOUNT_ID: "${param:GALLABOX_ACCOUNT_ID}",
        GALLABOX_SALES_TEAM_ID: "${param:GALLABOX_SALES_TEAM_ID}",
        GALLABOX_API_URL: "${param:GALLABOX_API_URL}",
        REDIS_HOST: "n8n-mem-cache-xlaonl.serverless.use2.cache.amazonaws.com",
        REDIS_PASSWORD: "${self:custom.ssmKeys.REDIS_PASSWORD}",
        PRD_SUPABASE_PROJECT_URL: "https://cibgvzosquflnscharso.supabase.co",
        PRD_SUPABASE_KEY: "${self:custom.ssmKeys.PRD_SUPABASE_KEY}",
        MASTRA_API_URL: "${param:MASTRA_API_URL}",
        MASTRA_API_KEY: "${self:custom.ssmKeys.MASTRA_API_KEY}",
        PRD_MASTRA_API_KEY: "${self:custom.ssmKeys.PRD_MASTRA_API_KEY}",
      },
      vpc: {
        securityGroupIds: ["sg-01ad57ca651860605"],
        subnetIds: [
          "subnet-0f432cb7e59af46e4",
          "subnet-0df6b7728aaa08f25",
          "subnet-0f606c435bdb5507e",
        ],
      },
    },
    sqsLiaFailedQuotationRetryDLQ: {
      name: "loovi-serverless-${opt:stage, 'dev'}-lia-failed-quotation-retry-dlq",
      handler: "src/lia-failed-quotation-retry/dlq.run",
      timeout: 30,
      events: [
        {
          sqs: {
            arn: {
              "Fn::GetAtt": ["LiaFailedQuotationRetryQueueDLQ", "Arn"],
            },
          },
        },
      ],
      environment: {
        SEGMENT_API_KEY: "QcF3GovxQGxp4JpsOOCOLdPe46r0KN7F",
        STAGE: "${param:STAGE}",
      },
      vpc: {
        securityGroupIds: ["sg-01ad57ca651860605"],
        subnetIds: [
          "subnet-0f432cb7e59af46e4",
          "subnet-0df6b7728aaa08f25",
          "subnet-0f606c435bdb5507e",
        ],
      },
    },
    // blackfriday2025EmailMkt: {
    //   name: "loovi-serverless-${opt:stage, 'dev'}-blackfriday-2025-email-mkt",
    //   handler: "src/blackfriday-2025-email-mkt/handler.run",
    //   timeout: 900,
    //   package: {
    //     patterns: [
    //       "us-east-1-bundle.pem",
    //       "src/blackfriday-2025-email-mkt/index.html",
    //     ],
    //   },
    //   events: [
    //     {
    //       schedule: "cron(0/6 11-22 ? * * *)",
    //     },
    //   ],
    //   environment: {
    //     STAGE: "${param:STAGE}",
    //     NODE_EXTRA_CA_CERTS: "/us-east-1-bundle.pem",
    //     NODE_TLS_REJECT_UNAUTHORIZED: "0",
    //     DATABASE_URL: "${self:custom.ssmKeys.RDS_SEGMENT_READ_URL}",
    //     REDIS_PASSWORD: "${self:custom.ssmKeys.REDIS_PASSWORD}",
    //     REDIS_HOST: "n8n-mem-cache-xlaonl.serverless.use2.cache.amazonaws.com",
    //   },
    //   vpc: {
    //     securityGroupIds: ["sg-01ad57ca651860605"],
    //     subnetIds: [
    //       "subnet-0f432cb7e59af46e4",
    //       "subnet-0df6b7728aaa08f25",
    //       "subnet-0f606c435bdb5507e",
    //     ],
    //   },
    // },
  },
  resources: {
    Resources: {
      ...sqsDlqResource!.Resources,
      ...sqsResource!.Resources,
      ...sqsLiaFailedQuotationRetry!.Resources,
      ...sqsRetryQuotationDlqResource!.Resources,
    },
  },
  plugins: ["serverless-offline"],
  package: {
    individually: true,
    excludeDevDependencies: true,
    patterns: [
      "!node_modules/**",
      "!dist/**",
      "!src/**",
      "ioredis",
      "node-fetch",
      "node-fetch/**",
      "googleapis",
      "googleapis/**",
    ],
  },
};
module.exports = serverlessConfiguration;
