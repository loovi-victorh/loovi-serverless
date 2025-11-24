import "dotenv/config";
// import { run } from "./handler";
import { mockEvent } from "./mock-event";
import { run } from "./dlq";

async function execute() {
  await run(mockEvent as any, {} as any);
}

execute();
