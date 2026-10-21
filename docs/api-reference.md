# API Reference

Import public functions from `@eliware/log`.
The package supports native ESM.

```js
import log, {
  createLogger,
  createPolicy,
  defaultPolicy,
  log as namedLog,
  redactHeaders,
  redactText,
  redactValue,
  replaceLiteralSecret,
  safeSerialize,
} from "@eliware/log";
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

The function accepts `RedactionOptions`, which aliases `SerializationOptions`.
The `SafeSerializedValue` type describes its recursive output shape.
See [Safe serialization](safe-serialization.md) for options, limits, and markers.

## Redact functions

The package root also exports the stable functions from `@eliware/redact`.
Use these functions when an application needs redaction outside logger output.

```js
import {
  createPolicy,
  defaultPolicy,
  redactHeaders,
  redactText,
  redactValue,
  replaceLiteralSecret,
} from "@eliware/log";

const policy = createPolicy({ keys: [...defaultPolicy.keys, "sessionId"] });
const cleanValue = redactValue({ sessionId: "example-value" }, policy);
const cleanHeaders = redactHeaders({ Authorization: "Bearer example-token" });
const cleanText = redactText("token=example-token");
const cleanMessage = replaceLiteralSecret("value=example-secret", "example-secret");
```

### `createPolicy(options)` and `defaultPolicy`

Call `createPolicy()` to make a read-only policy from redaction options.
Read `defaultPolicy` to use the package default keys and marker.
Pass the policy to a redaction function that accepts policy options.
The policy stores key names in a read-only set.

### `redactValue(value, options)`

Return a redacted copy of a structured value.
The function checks property names and does not scan text inside string values.
It supports objects, arrays, and Error values.
It applies the configured traversal limits.
It returns primitive values without changing them.

For arrays, `maxKeys` limits non-sensitive index and non-index property values together.
The function marks sensitive array properties without reading their values after the limit is reached.
It adds `[TRUNCATED]` when it omits array values or properties.

### `redactHeaders(headers, options)`

Redact sensitive header values in an object, an array of name-value pairs, or an object with an `entries()` method.
The function keeps header names for object input and keeps duplicate names for array input.
The function returns lowercase header names for `entries()` input and keeps the last duplicate value.
Header name checks ignore uppercase and lowercase differences.

### `redactText(value, options)`

Convert a value to text and redact supported credential patterns, configured key names, and supplied literal secrets.
The function returns an empty string for `null` and `undefined` values.
It applies built-in rules to authorization values, key assignments, provider tokens, JSON Web Tokens, and key material.
It applies a default output limit of 10,000 characters.
Set `maxOutputLength` to change the limit.

The function limits input before it applies redaction rules.
It uses bounded lookahead to redact a configured secret when the input limit cuts through it.
It adds `[TRUNCATED]` when it cuts output.
If the limit is shorter than that marker, it returns `…`.

The built-in rules can miss secrets or redact text that is not secret.

### `replaceLiteralSecret(value, secret, marker)`

Replace each exact, case-sensitive occurrence of one literal secret.
The function converts `null` and `undefined` values to empty text.
If the secret is empty, `null`, or `undefined`, the function leaves the text unchanged.
The default marker is `[REDACTED]`.

## Redaction option types

`RedactionPolicy` accepts `keys`, the `redactKeys` alias, `marker`, and `circularMarker`.
The default marker is `[REDACTED]`.
`circularMarker` applies to `redactValue()` only.
The key list defaults to the sensitive names listed in [Safe serialization](safe-serialization.md).
Set `keys` or `redactKeys` to replace that list.

`StructuredRedactionOptions` adds `maxDepth`, `maxKeys`, and `maxArray` to `RedactionPolicy`.
Their defaults are 20, 1,000, and 1,000.
These limits control depth, retained properties, and retained array items.

`TextRedactionOptions` adds `secrets` and `maxOutputLength` to `RedactionPolicy`.
Pass one secret string or an iterable of secret strings in `secrets`.
The function matches supplied secrets exactly and keeps letter case.
The text output limit defaults to 10,000 characters.
Set `marker` to change replacements for configured keys and supplied secrets.

`SerializationOptions` adds `maxString` to the structured traversal limits.
Its `maxString` default is 10,000 characters.
See [Safe serialization](safe-serialization.md) for the full serialization rules.

The package exports the `RedactionPolicy`, `SerializationOptions`, `StructuredRedactionOptions`, and `TextRedactionOptions` types.
`RedactionOptions` remains an alias for `SerializationOptions`.
Read the [safe data guide](safety-and-troubleshooting.md) before you share redacted output.

## TypeScript

The package provides declarations for its root import.
Use this example to import the public types:

```ts
import log, { createLogger, safeSerialize } from "@eliware/log";
import type {
  LoggerWithConfiguredLevels,
  RedactionPolicy,
  RedactionOptions,
  SerializationOptions,
  SafeSerializedValue,
  StructuredRedactionOptions,
  TextRedactionOptions,
} from "@eliware/log";

const logger = createLogger({ format: "json" });
const configuredLog: LoggerWithConfiguredLevels = log;
const options: RedactionOptions = { keys: ["token"] };
const value: SafeSerializedValue = safeSerialize({ token: "example" }, options);
log.info("Created a logger", { ready: true });
logger.info("Serialized a value", { value });
configuredLog.info("Configured level example", { value });
```

The declarations include these public types:

- `LoggerWithConfiguredLevels`
- `RedactionPolicy`
- `RedactionOptions`
- `SerializationOptions`
- `SafeSerializedValue`
- `StructuredRedactionOptions`
- `TextRedactionOptions`

Import values and types from `@eliware/log`.
