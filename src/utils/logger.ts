import {Database} from "../database/database";

const insertLog = (type: string, msg: string) => {
  Database.instance().connection()?.query('INSERT INTO log SET ?', { type: type, message: msg}, function (error, results, fields) {
    if (error) throw error;
  })
}

export function useLogger() {
  return {
    info: (message: string, ctx: string = "#N") => {
      console.log(`[EMS] | ✅ INFO | ${ctx} > ${message}`);
      insertLog('INFO', message);
    },
    warn: (message: string, ctx: string = "#N") => {
      console.log(`[EMS] | ⚠️ WARN | ${ctx} > ${message}`);
      insertLog('WARN', message);
    },
    error: (message: string, ctx: string = "#N") => {
      console.log(`[EMS] | ☠️ ERROR | ${ctx} > ${message}`);
      insertLog('ERROR', message);
    },
  };
}
