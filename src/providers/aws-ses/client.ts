import { SESClient } from "@aws-sdk/client-ses";

// Create SES service object.
const sesClient = new SESClient({ region: "us-east-1" });
export { sesClient };
