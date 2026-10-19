# Safe Serialization

`safeSerialize()` returns a bounded representation of a value.
It does not call `toJSON()`.
The logger uses this helper for non-string messages and metadata.

```js
import { safeSerialize } from "@eliware/log";

const value = { token: "example-token", count: 2n };
console.log(safeSerialize(value));
```

The helper returns plain values and text labels for JSON output.
It keeps `null`, Boolean, and number values.
It writes BigInts as text with an `n` suffix.
It writes `undefined` as `[Undefined]`.
It writes functions as `[Function: name]` and symbols as `[Symbol: description]`.
It writes buffers as `[Buffer length=N]` without exposing buffer contents.

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

Key checks ignore uppercase and lowercase differences.
If you set `keys`, that list replaces the default list.
The direct `safeSerialize()` call uses the default sensitive key list when you omit options.
The safe serializer always uses `[CIRCULAR]` for cycles.
The `circularMarker` option does not change this marker.

The default key names are `token`, `accessToken`, `authToken`, `authorization`, `cookie`, `set-cookie`, `proxy-authorization`, `password`, and `passwd`.
They also include `secret`, `clientSecret`, `apiKey`, `api-key`, `accessKey`, `privateKey`, `passphrase`, `credential`, `webhook`, `signature`, `tlsKey`, and `tlsCert`.

## Limits and markers

The helper uses `[CIRCULAR]` for circular values.
It uses `[TRUNCATED]` when a nested value exceeds `maxDepth` or the helper omits values.
It uses `...[TRUNCATED]` when it cuts a long string and the marker fits.
It uses `…` when the string limit is shorter than the marker.

It uses `[UNSERIALIZABLE]` when serialization fails.
It returns `{}` when it cannot read a retained object property.
It adds a `__truncated` property when it omits object keys.
It adds `[TRUNCATED]` to an array when it omits array items.

The helper counts the root value at depth zero.
It truncates a child when its depth is greater than `maxDepth`.
It floors finite fractional values for `maxDepth`, `maxKeys`, and `maxArray`.
It changes negative limits to zero and uses defaults for non-finite limits.

The helper reads enumerable own string-keyed object properties.
It omits enumerable symbol-keyed object properties.
It preserves sparse array holes and ignores inherited array indexes.
It omits custom array properties.
The helper has no total output length limit.
The `maxString` option limits each string and primitive label.

## Redaction in logger formats

`createLogger()` sets `keys` to an empty list by default.
Set the option to redact sensitive metadata property names.
The option list replaces the default key list from `@eliware/redact`.
The formatter does not scan string messages for secrets.
The formatter safely serializes object messages and metadata with the configured keys.
