import log, {
  createLogger,
  createPolicy,
  defaultPolicy,
  redactHeaders,
  redactText,
  redactValue,
  replaceLiteralSecret,
  safeSerialize,
} from "@eliware/log";
import type {
  LoggerWithConfiguredLevels,
  RedactionPolicy,
  RedactionOptions,
  SafeSerializedValue,
  SerializationOptions,
  StructuredRedactionOptions,
  TextRedactionOptions,
} from "@eliware/log";

const policyOptions: RedactionPolicy = { keys: [...defaultPolicy.keys, "sessionId"] };
const logger = createLogger({ transports: [] });
const configuredLog: LoggerWithConfiguredLevels = log;
const serializationOptions: SerializationOptions = { ...policyOptions, maxDepth: 5 };
const structuredOptions: StructuredRedactionOptions = { ...policyOptions, maxKeys: 10 };
const textOptions: TextRedactionOptions = { ...policyOptions, secrets: ["example-secret"] };
const legacyOptions: RedactionOptions = serializationOptions;
const policy = createPolicy(policyOptions);
const serialized: SafeSerializedValue = safeSerialize({ token: "example-token" }, legacyOptions);

redactHeaders({ authorization: "example-token" }, structuredOptions);
redactText("token=example-token", textOptions);
redactValue({ sessionId: "example-value" }, policy);
replaceLiteralSecret("value=example-secret", "example-secret");
log.info("Public API type check", { serialized });
logger.info("Configured logger type check", { serialized });
configuredLog.info("Configured levels type check", { serialized });
