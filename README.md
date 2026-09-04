# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/log [![npm version](https://img.shields.io/npm/v/@eliware/log.svg)](https://www.npmjs.com/package/@eliware/log) [![license](https://img.shields.io/github/license/eliware/log.svg)](LICENSE) [![build status](https://github.com/eliware/log/actions/workflows/nodejs.yml/badge.svg)](https://github.com/eliware/log/actions)

> A minimal, flexible logging library for Node.js, built on top of [winston](https://github.com/winstonjs/winston). Supports ESM, with TypeScript types included.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [ESM Example](#esm-example)
  - [API](#api)
- [TypeScript](#typescript)
- [Errors / Troubleshooting](#errors--troubleshooting)
- [Development](#development)
- [Operations](#operations)
- [Support](#support)
- [License](#license)
- [Links](#links)

## Features

- Simple, consistent logging API for Node.js
- Built on [winston](https://github.com/winstonjs/winston)
- Supports ESM
- Default and named exports for maximum flexibility
- TypeScript type definitions included
- Supports structured JSON output with optional timestamps
- Supports child loggers with persistent context
- Serializes Error objects with name, message, and stack
- Supports configurable metadata redaction
- Exports `safeSerialize` for defensive metadata summarization
- **Supports logging primitives and arrays as meta:**
  - `log.info('msg', 42)` logs `{ value: 42 }`
  - `log.info('msg', [1,2,3])` logs `{ value: [1,2,3] }`

## Requirements

- Node.js 20 or newer
- Node.js 20 is the minimum supported runtime.

## Installation

```bash
npm install @eliware/log
```

## Usage

### ESM Example

```js
// Example usage for ESM
import log, { log as namedLog, createLogger } from '@eliware/log';

log.info('Hello from example.mjs (default import)', { foo: 'bar' });
log.info('Primitive value', 42); // primitive value
log.info('Array value', [1,2,3]); // array value

namedLog.info('Hello from example.mjs (named import)', { foo: 'bar' });
namedLog.info('Primitive value', 'test'); // primitive value

const customLogger = createLogger({ level: 'debug' });
customLogger.debug('Custom logger debug message', { custom: true });
customLogger.debug('Primitive debug', true); // primitive value
```

## API

### log (default and named export)

A pre-configured logger instance. Available as both the default and a named export (`log`).

- `.info(message, meta?)`
- `.debug(message, meta?)`
- `.warn(message, meta?)`
- `.error(message, meta?)`
- ...and all other [winston](https://github.com/winstonjs/winston) logger methods.

**Meta argument:**

- If you pass a primitive or array as the second argument, it will be logged as `{ value: ... }`.
- If you pass an object, it will be logged as usual.

### createLogger(options)

Creates a new [winston](https://github.com/winstonjs/winston) logger instance.

**Options:**

- `level` (string): Log level (default: `'info'`; invalid values throw a `TypeError`)
- `transports` (array): Array of winston transports (default: Console)
- `format` (`text` or `json`): Output format (default: `text`)
- `timestamp` (boolean): Include timestamps in JSON output (default: `false`)
- `redactKeys` (string[]): Metadata keys to redact, case-insensitively

**Returns:** a `winston.Logger` with the configured transports, format, timestamp behavior, and redaction rules.

### safeSerialize(value, redactKeys?: Set<string>)

Safely serializes a value for logging without invoking `toJSON`. Errors intentionally include only their `name`, `message`, and `stack`; enumerable custom Error properties are omitted. Functions, BigInts, arrays, nested objects, circular references, and hostile property access are handled defensively. Objects and arrays are recursively preserved, with circular values replaced by `[Circular]`. Pass a `Set` of keys to redact matching keys at every traversed level and Error fields; keys are normalized case-insensitively for direct `safeSerialize` calls and `createLogger`. Example: `safeSerialize(metadata, new Set(['token']))`. JSON-format redaction covers enumerable string-keyed metadata present when Winston formats the record; transport-added metadata is outside this boundary.

## TypeScript

Type definitions are included:

```ts
export declare function createLogger(options?: {
  level?: string;
  transports?: import('winston').Transport[];
  format?: 'text' | 'json';
  timestamp?: boolean;
  redactKeys?: string[];
}): import('winston').Logger & {
  debug(message: string, meta?: unknown, ...args: unknown[]): import('winston').Logger;
  info(message: string, meta?: unknown, ...args: unknown[]): import('winston').Logger;
  warn(message: string, meta?: unknown, ...args: unknown[]): import('winston').Logger;
  error(message: string, meta?: unknown, ...args: unknown[]): import('winston').Logger;
};
export type SafeSerializedValue = null | boolean | number | string | SafeSerializedValue[] | { [key: string]: SafeSerializedValue };
export declare function safeSerialize(value: unknown, redactKeys?: Set<string>): SafeSerializedValue;
export declare const log: import('winston').Logger & {
  debug(message: string, meta?: unknown, ...args: unknown[]): import('winston').Logger;
  info(message: string, meta?: unknown, ...args: unknown[]): import('winston').Logger;
  warn(message: string, meta?: unknown, ...args: unknown[]): import('winston').Logger;
  error(message: string, meta?: unknown, ...args: unknown[]): import('winston').Logger;
};
export default log;
```

## Errors / Troubleshooting

Use `redactKeys` for sensitive metadata; it applies to metadata keys, not log message text. Objects and arrays are recursively preserved and circular values encountered during traversal are replaced with `[Circular]`. Deep or oversized values are truncated with `[Truncated]`. Error fields and nested object keys are subject to redaction. JSON output includes timestamps only when `timestamp: true`; text output safely serializes objects and BigInt values. Configure transports explicitly for tests and alternate destinations. `safeSerialize` returns a recursive `SafeSerializedValue` shape; functions, symbols, and hostile values are represented by safe strings.

## Development

```bash
npm test
npm run lint
npm run typecheck
npm audit --omit=dev --audit-level=moderate
npm run pack
```

## Operations

The package has no import-time external I/O. Inject Winston transports with `createLogger()` for application-specific destinations and configure the explicit `level` option for runtime verbosity. The public package entrypoint is composed in `src/index.mjs`; consumers should import from `@eliware/log`, not from internal source paths. Metadata is sanitized eagerly before formatting so records are deterministic even when a transport later filters them by level. Custom transports that add sensitive metadata after formatting must sanitize those additions themselves.

## Security

Do not log secrets or sensitive payloads. Configure `redactKeys` for credential-bearing metadata and review custom transports before enabling them.

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## License

[MIT © 2025 Eli Sterling, eliware.org](LICENSE)

## Links

- [Home Page](https://eliware.org)
- [GitHub](https://github.com/eliware/log)
- [npm](https://www.npmjs.com/package/@eliware/log)
- [Discord](https://discord.gg/M6aTR9eTwN)
- [Winston Logger](https://github.com/winstonjs/winston)
