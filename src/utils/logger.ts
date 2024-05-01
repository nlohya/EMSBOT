import { Database, query } from "../database";

const insertLog = (type: string, msg: string) => {
  query(`INSERT INTO log VALUES (null, null, '${type}', '${msg}')`);
};

export function useLogger() {
  return {
    info: (message: string, ctx: string = "#N") => {
      console.log(`[EMS] | ✅ INFO | ${ctx} > ${message}`);
      insertLog("INFO", message);
    },
    warn: (message: string, ctx: string = "#N") => {
      console.log(`[EMS] | ⚠️ WARN | ${ctx} > ${message}`);
      insertLog("WARN", message);
    },
    error: (message: string, ctx: string = "#N") => {
      console.log(`[EMS] | ☠️ ERROR | ${ctx} > ${message}`);
      insertLog("ERROR", message);
    },
  };
}
