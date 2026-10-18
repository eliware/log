# Release Notes

## 13.0.0 — 2026-10-17

### Changed

- Clarified that safe serialization includes enumerable custom Error fields.

## 12.0.0 — 2026-10-12

### Changed

- Updated Winston to v3.19 and `@eliware/redact` to v12.
- Moved the runtime entrypoint and type declarations under `src/`. The package import uses `@eliware/log`.
- Added bounded, recursive serialization for nested metadata, non-string messages, and circular values.
- Added validation for logger levels, formats, transports, and redaction keys.
- Added end-user guides and runnable examples for installation, configuration, logging, and safe serialization.

### Breaking changes

- The `createLogger()` option changed from `redactKeys` to `keys`.
- Pass a `RedactionOptions` object as the second `safeSerialize()` argument.
- Direct `safeSerialize()` calls use Redact's default key list when you omit options.
- The logger uses `info` when no `level` option is set. `LOG_LEVEL` has no effect.
- Nested objects serialize recursively to configured limits.
- Earlier versions reduced nested objects to type, ID, and name summaries.
- Serialization uses `[CIRCULAR]`, `[TRUNCATED]`, and `[UNSERIALIZABLE]` markers.
