import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "..", "src/.env") });

export const DISCORD_CHANNEL_WEBHOOK_URL: string = String(
  process.env["DISCORD_CHANNEL_WEBHOOK_URL"]
);
