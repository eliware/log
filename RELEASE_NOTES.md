# Release Notes

## 14.0.0 — 2026-10-20

### Changed

- Update `@eliware/redact` and `@eliware/test` to 14.0.0.
- Refresh transitive dependency versions in `package-lock.json`.
- Match the package and public specification versions to Convention 14.
- Align repository instructions with Convention 14 requirements.

## 13.0.0 — 2026-10-19

### Changed

- Update `@eliware/redact` to 13.0.0 and use its bounded safe serialization behavior.
- Update `@eliware/test` to 13.0.0 and refresh locked dependency versions.
- Clarify that JSON records support timestamps and text records do not.
- Document configured Winston levels, root exports, package files, release tags, and serialization limits.
- Remove the word `secure` from the package description.
- Align GitHub workflows with the shared workflow rules. Use checkout v7 and full Git history for validation.
- Rename the npm publication workflow to `npm.yaml` and align it with the canonical workflow.
- Update Knit deployment to run `git pull`, `npm ci`, and `npm test` in `/eliware/log`.
- Update the README, guides, specifications, and repository instructions for Convention 13.
- Add package features, troubleshooting steps, and data protection guidance to the README.

### Fixed

- Make each serialized string and primitive label no longer than `maxString` characters. Count truncation markers as part of the limit.

### Breaking changes

- `createLogger()` throws a `TypeError` when `timestamp` is not a Boolean value.

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
