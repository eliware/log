# Release Notes

## 6.0.0 — September 6, 2026

### Breaking changes

- Raised the minimum supported runtime to Node.js 26.
- Moved the public implementation and declarations under `src/` and aligned
  the package exports with the new layout.
- Delegated redaction and defensive serialization to `@eliware/redact`.

### Added

- Added focused source/test architecture, end-user documentation,
  specifications, runnable examples, and the repository environment contract.
- Added defensive JSON serialization for non-string messages, including Errors,
  BigInts, and circular values.

### Changed

- Standardized CI validation and npm publishing workflow across Eliware
  packages.

## 2.4.0 — September 3, 2026

### Changed

- Hardened serialization of circular ordinary objects and hostile Proxy values.
- Added validation for custom logger levels with clear configuration errors.
- Improved serializer redaction normalization and defensive cleanup across recursive paths.
- Expanded TypeScript declarations with a recursive `SafeSerializedValue` result type.
- Clarified JSON metadata redaction boundaries and deterministic transport formatting.
- Expanded regression coverage while preserving 100×4 coverage.

## 2.1.0 — September 2, 2026

### Changed

- Decomposed the logger implementation into focused modules under `src/` while preserving the root public entrypoint.
- Split the test suite into focused files mirroring the implementation structure.
- Hardened metadata serialization for BigInts, circular arrays, hostile objects, nested Errors, redaction, and prototype-pollution keys.
- Added deployment validation for test, lint, typecheck, audit, and package checks.

## 2.0.0 — August 25, 2026

### Changed

- Adopted `@eliware/test` for the standard test and lint harness.
- Replaced direct Jest/Oxlint scripts and dependencies with `eliware-test` commands.
- Integrated 100×4 coverage-gap reporting into `npm test`.
- Added production dependency auditing to CI validation.
- Updated CI to validate on `main`, pull requests, and `v*` tags on Ubuntu and Windows.
- Split validation and npm publishing into separate jobs; publishing now requires both platform validations and is limited to `v*` tags with publish-only credentials.

## 1.1.12 — August 10, 2026

- Hardened Error serialization against throwing property accessors.
- Preserved arrays during metadata serialization, including nested redaction.
- Added redaction coverage for Error fields and child logger primitive metadata.
- Updated serializer and troubleshooting documentation.


## 1.1.11 — August 7, 2026

- Aligned repository layout, scripts, CI, documentation, and package contents with Eliware library conventions.
- Added TypeScript declaration checking and standardized package validation.
- Moved tests under `tests/` and included a runnable `examples/` file in the package.
- Removed legacy `module` metadata from this ESM-only package.
- Verification: tests, coverage, gap checks, lint, typecheck, smoke test, and package dry-run pass.

## 1.1.10

- Improved the coverage-gap filter to report only files with uncovered metrics.

## 1.1.5 — Current changes

- Standardized Node.js 26 CI workflow.
- Normalized Jest coverage and gap-testing scripts.
- Added AgentX artifact ignore rules.
- Updated dependencies and lockfiles.

## Version history

- `1.1.1` — Version 1.1.1 - 12-08-2025.
- `1.1.2` — Version 1.1.2 - 12-21-2025.
- `1.1.3` — Version 1.1.3 - 12-21-2025.
- `1.1.4` — Version 1.1.4 - 07-01-2026.


## 1.1.6

- Added the standardized Oxlint command.
- Updated package metadata and lockfiles for the latest maintenance pass.
- Synchronized the package with the current Eliware Node.js 26 workflow conventions.

## 1.1.8

- Removed legacy CommonJS entry points and tests in favor of ESM.
- Added structured JSON logging, timestamps, error serialization, redaction, and child logger context.
- Expanded logger tests to 100% coverage across statements, branches, functions, and lines.
- Updated TypeScript declarations, README documentation, package metadata, and dependencies.
- Added manual GitHub Actions workflow dispatch support.

## 1.1.9

- Removed all Istanbul coverage-ignore directives.
- Removed unreachable circular-reference and Winston-level fallback logic.
- Simplified metadata serialization while preserving redaction, error, BigInt, function, and hostile-object handling.
- Exported `safeSerialize` for focused testing and reuse.
- Expanded serializer tests to cover defensive paths directly.
- Restored 100% statements, branches, functions, and lines coverage without ignore directives.
