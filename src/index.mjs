import { createLogger } from "./create-logger.mjs";
export {
  createPolicy,
  defaultPolicy,
  redactHeaders,
  redactText,
  redactValue,
  replaceLiteralSecret,
  safeSerialize,
} from "@eliware/redact";
export { createLogger };

const log = createLogger();
export default log;
export { log };
