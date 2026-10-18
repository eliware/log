# AGENTS.md

## Project

This repository maintains `@eliware/log`, a structured ESM package for Node.js records, redaction, and safe serialization.

## Scope and boundaries

This repository owns the package code and public API.
Use `README.md` for package purpose, scope, and ownership.
Use `eliware/test` for shared rules and `eliware/docs` for documentation indexes.

## Layout

Use `README.md`, `docs/README.md`, `examples/README.md`, and `specs/README.md` to find repository files.

## Development

Use Node.js 26 or later and npm 12 or later.
Use native ESM for maintained JavaScript files.
Keep each source and test module focused on one responsibility.
Keep `src/` and `tests/` mirrored.
Keep public exports and declarations in sync.
Update guides, tests, declarations, examples, and release notes when public behavior changes.

## Validation

- Run `npm ci` after dependency changes.
- Run `npm run lint` for lint checks.
- Run `npm run audit` for dependency checks.
- Run `npm run format` to format files.
- Run `npm run format:check` to check formatting.
- Run `npm run typecheck` to check declarations.
- Run `npm run pack` to check package contents.

## Security

Keep credentials, secrets, private data, and runtime state out of Git.
Use safe placeholders for secret values in examples.

## Changes

Keep changes in this repository.
Record user-visible changes in `RELEASE_NOTES.md`.
Use Eliware Operations for approval before external changes.

## Library

Document public APIs, supported use, and package contents in `README.md`.

- Run focused tests first during development.
- Run one test file with `npm test -- tests/path/to/example.test.mjs`.
- Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
- Prevent repeated full-suite runs during development.
- Run the full `npm test` suite for final validation before a commit, milestone, or release.

## npm publication

Include `specs/` in the package.
Document installation, entrypoints, package contents, and release limits in `README.md`.
Publish only after approval through the Operations release handoff.
