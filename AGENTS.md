# AGENTS.md

## Project

Maintain `@eliware/log`, a Node.js 26 library for structured logs, redaction, and safe serialization.

## Scope and boundaries

This repository owns the library code and public API.
`eliware/test` owns shared requirements. `eliware/docs` owns documentation indexes. `eliware/operations` owns release procedures.

## Layout

Keep source modules in `src/`, mirrored tests in `tests/`, user guides in `docs/`, specifications in `specs/`, and runnable examples in `examples/`.

## Development

Use Node.js 26, native ESM, `.mjs` files, and npm.
Give each source and test module one cohesive purpose.
Keep each source module under 100 lines and each test module under 200 lines.
Keep `src/` and `tests/` mirrored.
Keep the public API and its declarations in sync.
Update user guides, tests, declarations, examples, and release notes when public behavior changes.

## Validation

Run `npm ci` after dependency changes.
Run `npm test` for aggregate validation.
Run `npm run lint` for code checks.
Run `npm run audit` for dependency checks.
Run `npm run format:check` for read-only format checks.
Run `npm run typecheck` to check declarations.
Run `npm run pack` to check package contents.

## Security

Keep secrets, credentials, private data, and machine state out of repository files.
Use safe placeholders for secret values in examples.

## Changes

Record user-visible changes in `RELEASE_NOTES.md`.
Use the Operations release handoff before publication.

## Library

Use `src/index.mjs` as the public runtime entrypoint.
Use `src/index.d.ts` for public declarations.
Keep exports and declarations in sync.
Test the public API and supported package contents.

## npm publication

Publish only after approval through the Operations release handoff.
