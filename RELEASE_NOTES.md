# Release Notes

## 15.0.0 — 2026-10-21

### Changed

- Update `@eliware/redact` and `@eliware/test` to 15.0.0. Refresh locked dependencies and align the package and specification versions with Convention 15.
- Document Redact 15 text truncation and array property limits. Correct the TypeScript logger example.

### Fixed

- Allow metadata fields named `level` or `message` to replace the matching JSON fields.
- Use the exported Winston transport type and import the serialization options used by the public declarations.
- Declare `@types/node` so installed packages resolve Winston's declaration dependencies.
- Check public declarations with `skipLibCheck` disabled.

### Added

- Add a packed-package check that compiles documented imports in a strict TypeScript consumer outside the repository.

## 14.0.0 — 2026-10-21

### Changed

- Update `@eliware/redact` and `@eliware/test` to 14.0.0. Refresh locked transitive dependency versions.
- Match package metadata and the public specification version to Convention 14. Align repository guidance with its requirements.
- Expand the Getting Started and API guides with package-root redaction exports. Remove duplicate README guide links.

### Added

- Re-export redaction functions and option types from the package root.
- Add ESM and TypeScript consumer checks for the package-root functions and types.

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
