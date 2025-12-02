import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { readFileSync } from "fs";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: {
      ca: readFileSync("us-east-1-bundle.pem"),
    },
  },
});
