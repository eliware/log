# Safe Serialization

`safeSerialize()` returns a bounded representation of a value.
It does not call `toJSON()`.
The logger uses this helper for non-string messages and metadata.

```js
import { safeSerialize } from "@eliware/log";

const value = { token: "example-token", count: 2n };
console.log(safeSerialize(value));
```

The helper returns JSON-safe values.
It writes BigInts as text with an `n` suffix.
It writes `undefined`, functions, symbols, and buffers as text labels.
It reads `name`, `message`, and `stack` fields from Error values.
It also serializes enumerable custom Error fields.
It applies redaction and output limits to those fields.

## Redaction options

Pass an options object to set key names, a marker, or output limits.

| Option       | Default                        | Effect                                  |
| ------------ | ------------------------------ | --------------------------------------- |
| `keys`       | `@eliware/redact` default keys | Set sensitive property names.           |
| `redactKeys` | none                           | Alias for `keys`.                       |
| `marker`     | `"[REDACTED]"`                 | Set text for a matching property value. |
| `maxDepth`   | `20`                           | Limit nested values.                    |
| `maxKeys`    | `1000`                         | Limit object properties.                |
| `maxArray`   | `1000`                         | Limit array items.                      |
| `maxString`  | `10000`                        | Limit strings and value labels.         |

Key checks ignore letter case.
If you set `keys`, that list replaces the default list.
The direct `safeSerialize()` call uses the default sensitive key list when you omit options.

The default key names are `token`, `accessToken`, `authToken`, `authorization`, `cookie`, `set-cookie`, `proxy-authorization`, `password`, and `passwd`.
They also include `secret`, `clientSecret`, `apiKey`, `api-key`, `accessKey`, `privateKey`, `passphrase`, `credential`, `webhook`, `signature`, `tlsKey`, and `tlsCert`.

## Limits and markers

The helper uses `[CIRCULAR]` for circular values.
It uses `[TRUNCATED]` when it omits values or cuts a string.
It uses `[UNSERIALIZABLE]` when it cannot serialize a value.
It returns `{}` when it cannot read a retained object property.

The root value starts at depth zero.
The helper counts a child past `maxDepth` as truncated.
The helper adds a marker when it omits array items or object keys.

## Redaction in logger formats

`createLogger()` sets `keys` to an empty list by default.
Set the option to protect metadata property names.
The option list replaces the default key list from `@eliware/redact`.
The formatter does not scan string messages for secrets.
The formatter safely serializes object messages and metadata with the configured keys.
