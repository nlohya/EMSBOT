import fs from "node:fs";
import { useLogger } from "./logger";

export interface Settings {
  setupDone: boolean;

  channelCitizen: string;

  categoryCitizen: string;

  channelEmployee: string;

  categoryEmployee: string;

  roleAccessId: string;
}

function save(settings: Settings) {
  try {
    fs.writeFileSync("config.cfg", JSON.stringify(settings), { flag: "w" });
    useLogger().info("Settings written successfully");
  } catch (err) {
    useLogger().error("Error happened while saving settings", "savecfg");
  }
}

function load(): Settings | null {
  try {
    return JSON.parse(fs.readFileSync("config.cfg", "utf8"));
  } catch (err) {
    useLogger().error("Error happened while loading settings", "loadcfg");
    return null;
  }
}

export function useSettings() {
  return {
    save,
    load,
  };
}
