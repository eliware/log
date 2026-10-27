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
| `timestamp`  | boolean                 | `false`           | Add a timestamp field to JSON records when true.   |
| `keys`       | string array            | `[]`              | Set property names that the formatter must redact. |

Winston provides these npm levels by default: `error`, `warn`, `info`, `http`, `verbose`, `debug`, and `silly`.
The logger also accepts a custom level in Winston's npm level map.
The logger rejects a level that the map does not define with a `TypeError`.
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
JSON records include ordinary metadata fields at the top level.
If metadata contains `level` or `message`, the formatter keeps the log fields and puts all metadata in `metadata`.

## Add timestamps

Set `timestamp: true` to add a timestamp field to each JSON record.
The text format does not add a timestamp.
Pass only `true` or `false` for `timestamp`.
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
The logger does not use the default sensitive key list from `@eliware/redact`.
Pass every property name that your application needs to redact.
See [Sensitive data and errors](safety-and-troubleshooting.md) before you write sensitive data.
