export function useLogger() {
  return {
    info: (message: string, ctx: string = "#N") => {
      console.log(`[EMS] | ✅ INFO | ${ctx} > ${message}`);
    },
    warn: (message: string, ctx: string = "#N") => {
      console.log(`[EMS] | ⚠️ WARN | ${ctx} > ${message}`);
    },
    error: (message: string, ctx: string = "#N") => {
      console.log(`[EMS] | ☠️ ERROR | ${ctx} > ${message}`);
    },
  };
}
