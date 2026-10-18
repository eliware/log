# API Reference

Import public functions from `@eliware/log`.
The package supports native ESM.

```js
import log, { createLogger, log as namedLog, safeSerialize } from "@eliware/log";
```

The default `log` export and named `log` export refer to the same logger.
Use `createLogger()` to make a logger with custom options.
Use `safeSerialize()` to make a bounded representation of a value.

## `createLogger(options)`

Create a Winston logger with supported package formats and redaction options.
The function returns a Winston logger with methods for configured levels.

```js
const logger = createLogger({
  level: "info",
  format: "json",
  timestamp: true,
  keys: ["token"],
});
```

See [Configure a logger](configuration.md) for each option and default.
See [Write logs](write-logs.md) for level methods, metadata, and child context.

## Logger methods

Call a level method with a message and optional metadata:

```js
logger.info("Request received", { requestId: "demo" });
```

The logger includes methods such as `error`, `warn`, `info`, `http`, `verbose`, `debug`, and `silly`.
Winston controls level filtering.
Call `logger.child(context)` to make a child logger with shared context.

## `safeSerialize(value, options)`

Convert a value to a bounded representation for output.
The function does not call `toJSON()`.
The result can contain JSON-safe values or text labels for special values.

```js
const clean = safeSerialize({ token: "example-token", count: 2n });
```

The function accepts `RedactionOptions` from `@eliware/redact`.
The `SafeSerializedValue` type describes its recursive output shape.
See [Safe serialization](safe-serialization.md) for options, limits, and markers.

## TypeScript

The package provides declarations in `src/index.d.ts`.
They include the logger options and these public types:

- `LoggerWithConfiguredLevels`
- `RedactionOptions`
- `SafeSerializedValue`

Import values and types from `@eliware/log`.
