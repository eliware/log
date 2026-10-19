# API Reference

Import public functions from `@eliware/log`.
The package supports native ESM.

```js
import log, { createLogger, log as namedLog, safeSerialize } from "@eliware/log";
```

The default `log` export and named `log` export refer to the same logger.
Use `createLogger()` to make a logger with custom options.
Use `safeSerialize()` to make a bounded representation of a value.
The package exports these values from its root path only.

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
The child logger uses the parent logger settings and adds its context to each record.

Winston lists these levels from first to last:

1. `error`
2. `warn`
3. `info`
4. `http`
5. `verbose`
6. `debug`
7. `silly`

The logger writes records at the configured level and all earlier levels in this list.
For example, `level: "info"` writes `info`, `warn`, and `error` records.

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

The package provides declarations for its root import.
Use this example to import the public types:

```ts
import log, { createLogger, safeSerialize } from "@eliware/log";
import type {
  LoggerWithConfiguredLevels,
  RedactionOptions,
  SafeSerializedValue,
} from "@eliware/log";

const logger: LoggerWithConfiguredLevels = createLogger({ format: "json" });
const options: RedactionOptions = { keys: ["token"] };
const value: SafeSerializedValue = safeSerialize({ token: "example" }, options);
log.info("Created a logger", { ready: true });
logger.info("Serialized a value", { value });
```

The declarations include these public types:

- `LoggerWithConfiguredLevels`
- `RedactionOptions`
- `SafeSerializedValue`

Import values and types from `@eliware/log`.
