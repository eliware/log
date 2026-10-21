import type { SerializationOptions as RedactSerializationOptions } from "@eliware/redact";

/**
 * Factory to create a Winston logger instance.
 * @param options Optional logger options.
 * @param options.level Log level (default: 'info'; invalid values throw a TypeError)
 * @param options.transports Array of winston transports (default: Console)
 * @param options.timestamp Add a timestamp to JSON records. The value must be a boolean.
 * @returns winston.Logger
 *
 * Note: All logger methods accept either (message, metaObject) or (message, primitive/array),
 * where primitives/arrays are wrapped as { value: ... }.
 */
export declare function createLogger(options?: {
  level?: string;
  transports?: import("winston").transport[];
  format?: "text" | "json";
  timestamp?: boolean;
  keys?: string[];
}): import("winston").Logger & {
  debug(message: unknown, meta?: unknown, ...args: unknown[]): import("winston").Logger;
  info(message: unknown, meta?: unknown, ...args: unknown[]): import("winston").Logger;
  warn(message: unknown, meta?: unknown, ...args: unknown[]): import("winston").Logger;
  error(message: unknown, meta?: unknown, ...args: unknown[]): import("winston").Logger;
};

export {
  createPolicy,
  defaultPolicy,
  redactHeaders,
  redactText,
  redactValue,
  replaceLiteralSecret,
} from "@eliware/redact";

/** Runtime-configured Winston levels are available dynamically; standard levels are typed explicitly above and custom levels remain runtime-discovered. */
export type LoggerWithConfiguredLevels = import("winston").Logger & { [level: string]: unknown };

/** Recursive JSON-safe result returned by safeSerialize. */
export type SafeSerializedValue =
  null | boolean | number | string | SafeSerializedValue[] | { [key: string]: SafeSerializedValue };

export type {
  RedactionPolicy,
  SerializationOptions,
  StructuredRedactionOptions,
  TextRedactionOptions,
} from "@eliware/redact";

/** Options accepted by safeSerialize. This alias preserves the original @eliware/log type name. */
export type RedactionOptions = RedactSerializationOptions;

/**
 * Safely serializes metadata without invoking toJSON.
 * Error values include name, message, stack, and enumerable custom properties, subject to redaction and limits.
 */
export declare function safeSerialize(
  value: unknown,
  options?: RedactionOptions,
): SafeSerializedValue;

/**
 * Default logger instance.
 *
 * All logger methods accept either (message, metaObject) or (message, primitive/array),
 * where primitives/arrays are wrapped as { value: ... }.
 */
export declare const log: import("winston").Logger & {
  debug(message: unknown, meta?: unknown, ...args: unknown[]): import("winston").Logger;
  info(message: unknown, meta?: unknown, ...args: unknown[]): import("winston").Logger;
  warn(message: unknown, meta?: unknown, ...args: unknown[]): import("winston").Logger;
  error(message: unknown, meta?: unknown, ...args: unknown[]): import("winston").Logger;
} & LoggerWithConfiguredLevels;
export default log;
