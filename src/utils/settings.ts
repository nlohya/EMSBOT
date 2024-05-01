import fs from "node:fs";
import { useLogger } from "./logger";

export enum TypeTicketCitizen {
  RDV = "rdv",
  ROLE = "role",
  SUGGESTION = "suggestion",
  QUESTIONS = "questions",
  PROBLEM = "problem",
  PARNTER = "partner",
  PPA = "ppa",
}

interface AccessRule {
  name: string;

  type: TypeTicketCitizen;

  acessId: string;
}

export interface Settings {
  setupDone: boolean;

  channelCitizen: string;

  categoryCitizen: string;

  channelEmployee: string;

  categoryEmployee: string;

  roleAccessId: string;

  accessRules?: Array<AccessRule>;
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

function update(settings: Settings) {
  try {
    const setts = JSON.parse(fs.readFileSync("config.cfg", "utf8"));

    Object.keys(settings).forEach((key) => {
      if (settings[key as keyof Settings] !== setts[key as keyof Settings]) {
        setts[key as keyof Settings] = settings[key as keyof Settings];
      }
    });

    save(setts);
  } catch (err) {
    useLogger().error("Error happened while updating settings", "updatecfg");
  }
}

export function useSettings() {
  return {
    save,
    load,
    update,
  };
}
