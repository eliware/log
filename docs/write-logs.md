# Write Logs

Call a level method to write a record.
The logger supports the Winston npm levels: `error`, `warn`, `info`, `http`, `verbose`, `debug`, and `silly`.

```js
import { createLogger } from "@eliware/log";

const logger = createLogger({ level: "debug" });
logger.info("Request received", { requestId: "demo", method: "GET" });
logger.debug("Cache lookup", { hit: true });
```

## Add metadata

Pass an object as the second argument to add metadata fields.
The logger places those fields beside the message in JSON output.
The text format adds a JSON metadata object after the message.

```js
logger.info("Request received", { requestId: "demo" });
```

Pass a primitive or array as the second argument to add it as `value`.

```js
logger.info("Retry count", 3);
logger.info("Tags", ["blue", "green"]);
```

The logger treats these calls as `{ value: 3 }` and `{ value: ["blue", "green"] }`.

## Add child context

Call `child()` to create a logger with shared context.
The child logger adds that context to each record.

```js
const requestLogger = logger.child({ requestId: "demo" });
requestLogger.info("Request received", { method: "GET" });
```

The record includes both `requestId` and `method`.
The child logger uses the parent level, format, timestamp, transports, and redaction keys.

## Read text output

The text format writes the level in uppercase brackets.
It writes a string message as text.
It adds metadata as JSON when metadata exists.

```text
[INFO] Request received {"requestId":"demo"}
```

The formatter safely serializes non-string messages and metadata.
See [Safe serialization](safe-serialization.md) for value rules.

## Read JSON output

The JSON format writes one JSON object for each record.
It uses `level` and `message` fields.
It adds metadata fields at the top level.
It adds `timestamp` when you set `timestamp: true`.

```json
{ "level": "info", "message": "Request received", "requestId": "demo" }
```

The formatter keeps string messages as text.
It safely serializes non-string messages and metadata.

## Use a custom transport

Pass a Winston transport in the `transports` array.
Install Winston as a direct application dependency if your application creates its own transport.
Check custom transport output for extra fields or later format changes.
