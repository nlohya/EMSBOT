import dotenv from "dotenv";
import { exit } from "process";
import { useLogger } from "./utils/logger";
import { TypeTicketCitizen } from "./utils/settings";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  useLogger().error(
    "Environnment variables not configured properly",
    "config.ts/#10"
  );
  exit();
} else {
  useLogger().info("Environnment configured properly", "config.ts/#13");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
};
