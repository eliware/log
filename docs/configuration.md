# Configure a Logger

Pass options to `createLogger()`.
The options control the level, transport list, output format, timestamp, and redaction keys.

```js
import winston from "winston";
import { createLogger } from "@eliware/log";

const logger = createLogger({
  level: "info",
  transports: [new winston.transports.Console()],
  format: "json",
  timestamp: true,
  keys: ["authorization", "sessionId", "token"],
});
```

## Options

| Option       | Type                    | Default           | Description                                        |
| ------------ | ----------------------- | ----------------- | -------------------------------------------------- |
| `level`      | string                  | `"info"`          | Set the lowest level that the logger writes.       |
| `transports` | Winston transport array | Console transport | Set one or more output destinations.               |
| `format`     | `"text"` or `"json"`    | `"text"`          | Select the record format.                          |
| `timestamp`  | boolean                 | `false`           | Add a timestamp to each record when true.          |
| `keys`       | string array            | `[]`              | Set property names that the formatter must redact. |

Use one of these Winston npm levels: `error`, `warn`, `info`, `http`, `verbose`, `debug`, or `silly`.
The logger rejects an unknown level with a `TypeError`.
The logger rejects a format other than `text` or `json`.
The logger rejects a transport value that is not an array.
The logger rejects a key list that is not an array of strings.

## Set the level

The default level is `info`.
The logger writes records at that level and at all higher levels.
For example, the `info` level also writes `warn` and `error` records.
Set `debug` to write records at `debug`, `verbose`, `http`, `info`, `warn`, and `error` levels.

## Set transports

The default transport writes to the console.
Pass a Winston transport array to select output destinations.
Pass an empty array to disable all output destinations.

```js
import winston from "winston";
import { createLogger } from "@eliware/log";

const logger = createLogger({
  transports: [new winston.transports.Console()],
});
```

The package formats records before it sends them to transports.
Examine custom transports if they add or change record data.

## Select a format

Use `text` to write one readable line for each record.
Use `json` to write one JSON object for each record.
Both formats include the level and message.
JSON records include metadata fields at the top level.

## Add timestamps

Set `timestamp: true` to add a timestamp to each record.
The default value is `false`.

## Set redaction keys

Set `keys` to property names that contain sensitive values.
Key checks ignore uppercase and lowercase differences.
The formatter checks nested objects and arrays.
The formatter replaces a matching value with `[REDACTED]`.

The default `keys` value is an empty array.
An empty list does not redact metadata by property name.
The list replaces the default key list from `@eliware/redact`.
Add every key name that your application needs to redact.
For example, include `token`, `access_token`, and `sessionId` when your data uses those names.

The formatter checks property names. It does not scan text inside string messages.
See [Sensitive data and errors](safety-and-troubleshooting.md) before you write sensitive data.
