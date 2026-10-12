# Release Notes

## 12.0.0 — 2026-10-12

### Changed

- Updated Winston to v3.19 and `@eliware/redact` to v12.
- Moved the runtime entrypoint and type declarations under `src/`. Package imports still use `@eliware/log`.
- Added bounded, recursive serialization for nested metadata, non-string messages, and circular values.
- Safe serialization includes enumerable custom properties from Error values, subject to redaction and output limits.
- Added validation for logger levels, formats, transports, and redaction keys.
- Added end-user guides and runnable examples for installation, configuration, logging, and safe serialization.

### Breaking changes

- Use `keys` instead of `redactKeys` in `createLogger()` options.
- Pass a `RedactionOptions` object to `safeSerialize()` instead of a `Set`.
- Direct `safeSerialize()` calls now use Redact's default key list when you omit options.
- Set the logger level in code. The `LOG_LEVEL` environment variable no longer sets the default level.
- Nested objects now serialize recursively within limits instead of reducing them to type, ID, and name summaries.
- Serialization now uses `[CIRCULAR]`, `[TRUNCATED]`, and `[UNSERIALIZABLE]` markers.
