# Release Notes

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
