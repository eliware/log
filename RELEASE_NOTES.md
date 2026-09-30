# Release Notes

## 9.0.0 — 2026-09-30

### Changed

- Aligned package metadata, directives, scripts, CI, Knit deployment, and package contents with v9 conventions.
- Replaced the local Redact path dependency with the published @eliware/redact package range.
- Preserved the logger runtime API and behavior.

## 6.0.0 — 2026-09-06

### Changed

- Raised the minimum supported runtime to Node.js 26.
- Moved implementation and declarations under src/ and aligned package exports with the library layout.
- Delegated redaction and defensive serialization to @eliware/redact.
- Added focused source and test architecture, documentation, specifications, runnable examples, and environment guidance.
- Standardized package validation and publication workflows.
