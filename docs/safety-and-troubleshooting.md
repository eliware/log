# Security and Common Errors

Redaction can reduce accidental disclosure.
It cannot detect every secret.
Treat all log data as information that users may see.

## Protect sensitive values

Do not pass credentials, access tokens, private keys, or passwords to a logger.
Set `keys` for each sensitive metadata property name.
Key checks ignore letter case but keep punctuation.
Add each spelling that your application uses.

The default logger key list is empty.
Without `keys`, the logger does not redact metadata by property name.
The formatter does not scan string messages.
Do not put a secret in a string message.

```js
import { createLogger } from "@eliware/log";

const logger = createLogger({
  keys: ["access_token", "authorization", "password", "sessionId", "token"],
});
```

Review the output before you send it to another service or person.
Use fake values in source files, tests, examples, and issue reports.

## Protect transport output

Use a custom transport only when you trust its code.
The package formats each record before it sends the record to a transport.
A custom transport can add fields or change output.
Check the final output from every custom transport.

## Fix common errors

| Error or symptom                 | Cause                                           | Action                                           |
| -------------------------------- | ----------------------------------------------- | ------------------------------------------------ |
| `Unknown logger level`           | The level is not a Winston npm level.           | Set a supported level such as `info` or `debug`. |
| `format must be text or json`    | The format value is invalid.                    | Set `format` to `text` or `json`.                |
| `transports must be an array`    | The transport value is not an array.            | Pass a Winston transport array.                  |
| `keys must be an array`          | The key value is not an array.                  | Pass a string array.                             |
| `keys must contain only strings` | A key is not a string.                          | Replace each non-string key.                     |
| A `debug` record does not appear | The current level blocks it.                    | Set `level` to `debug` or `silly`.               |
| A secret appears in a message    | String messages do not use key-based redaction. | Remove the secret before the call.               |

## Check output

Use `format: "json"` when another tool must parse records.
Parse one record per line.
Set `timestamp: true` when each record needs a time value.
Set `transports: []` in a test when the test needs no output.

## Get help

Read [Configure a logger](configuration.md) for option rules.
Read [Safe serialization](safe-serialization.md) for limits and markers.
Use the [GitHub issue page](https://github.com/eliware/log/issues) to report a defect.
Remove credentials and private data from each report.
