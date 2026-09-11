/**
 * Factory to create a Winston logger instance.
 * @param options Optional logger options.
 * @param options.level Log level (default: 'info'; invalid values throw a TypeError)
 * @param options.transports Array of winston transports (default: Console)
 * @returns winston.Logger
 *
 * Note: All logger methods accept either (message, metaObject) or (message, primitive/array),
 * where primitives/arrays are wrapped as { value: ... }.
 */
export declare function createLogger(options?: {
  level?: string;
  transports?: import('winston').Transport[];
  format?: 'text' | 'json';
  timestamp?: boolean;
  keys?: string[];
}): import('winston').Logger & {
  debug(message: unknown, meta?: unknown, ...args: unknown[]): import('winston').Logger;
  info(message: unknown, meta?: unknown, ...args: unknown[]): import('winston').Logger;
  warn(message: unknown, meta?: unknown, ...args: unknown[]): import('winston').Logger;
  error(message: unknown, meta?: unknown, ...args: unknown[]): import('winston').Logger;
};

/** Runtime-configured Winston levels are available dynamically; standard levels are typed explicitly above and custom levels remain runtime-discovered. */
export type LoggerWithConfiguredLevels = import('winston').Logger & { [level: string]: unknown };

/**
 * Recursive JSON-safe result returned by safeSerialize.
 */
/**
 * Safely serializes metadata without invoking toJSON.
 * Error custom properties are intentionally omitted; only name, message, and stack are retained.
 */
export declare function safeSerialize(value: unknown, options?: RedactionOptions): unknown;

export type RedactionOptions = import('@eliware/redact').SerializationOptions;

/**
 * Default logger instance.
 *
 * All logger methods accept either (message, metaObject) or (message, primitive/array),
 * where primitives/arrays are wrapped as { value: ... }.
 */
export declare const log: import('winston').Logger & {
  debug(message: unknown, meta?: unknown, ...args: unknown[]): import('winston').Logger;
  info(message: unknown, meta?: unknown, ...args: unknown[]): import('winston').Logger;
  warn(message: unknown, meta?: unknown, ...args: unknown[]): import('winston').Logger;
  error(message: unknown, meta?: unknown, ...args: unknown[]): import('winston').Logger;
} & LoggerWithConfiguredLevels;
export default log;
