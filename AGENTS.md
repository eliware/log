# AGENTS.md

## Project

Maintain `@eliware/log`. See README.md for its purpose and owner.

## Scope and boundaries

Keep repository requirements in specs/directives.yaml.

## Layout

Use README.md and specs/README.md to find repository paths.

## Development

Use Node.js 26 or later. Use native ESM for maintained JavaScript modules.

## Validation

Run npm test for aggregate validation.
Run npm run lint for lint checks.
Run npm run audit for dependency checks.
Run npm run format to format files.
Run npm run format:check to check formatting.

## Security

Do not commit credentials, secrets, or private data.

## Changes

Update RELEASE_NOTES.md for each user-visible change.

## Library

Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## npm publication

Run `npm run pack` to check package contents. Publish only after approved release steps.
