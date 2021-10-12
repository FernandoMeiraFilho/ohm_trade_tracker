import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "..", "src/.env") });

export const DISCORD_CHANNEL_WEBHOOK_URL: string = String(
  process.env["DISCORD_CHANNEL_WEBHOOK_URL"]
);

export const ETH_NODE_URL: string = String(process.env["ETH_NODE_URL"]);

export const ETH_ADDRESS: string = String(process.env["ETH_ADDRESS"]);

export const OHM_INITIAL_BALANCE: string = String(
  process.env["OHM_INITIAL_BALANCE"]
);

export const DATE_STARTED: string = String(process.env["DATE_STARTED"]);

export const VALUE_INVESTED: string = String(process.env["VALUE_INVESTED"]);
