/**
 * Factory to create a Winston logger instance.
 * @param options Optional logger options.
 * @param options.level Log level (default: process.env.LOG_LEVEL or 'info')
 * @param options.transports Array of Winston transports (default: Console)
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
  redactKeys?: string[];
}): import('winston').Logger & {
  debug(message: string, meta?: unknown): void;
  info(message: string, meta?: unknown): void;
  warn(message: string, meta?: unknown): void;
  error(message: string, meta?: unknown): void;
  // ...other winston log levels if needed
};

/**
 * Default logger instance.
 *
 * All logger methods accept either (message, metaObject) or (message, primitive/array),
 * where primitives/arrays are wrapped as { value: ... }.
 */
export declare const log: import('winston').Logger & {
  debug(message: string, meta?: unknown): void;
  info(message: string, meta?: unknown): void;
  warn(message: string, meta?: unknown): void;
  error(message: string, meta?: unknown): void;
  // ...other winston log levels if needed
};
export default log;
