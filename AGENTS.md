# AGENTS.md

Central convention authority: `eliware/docs`, `eliware/conventions`, and
`eliware/operations`. This project follows those repositories for shared
documentation, repository structure, and operational workflows.

Applies to: the entire repository unless a more specific `AGENTS.md` is added
in a descendant directory.

## Project

`@eliware/log` is an ESM logging library backed by Winston, with structured output, child loggers, serialization, and metadata redaction.

## API and security

- Preserve default/named logger exports and `createLogger()` behavior.
- Keep Error, BigInt, primitive, array, context, timestamp, and redaction behavior covered.
- Never expose secrets through logs; use `redactKeys` for sensitive metadata.
- Keep custom transports injectable and avoid external I/O during import.

## Validation

Run `npm test`, `npm run lint`, `npm run typecheck`, and `npm run pack`. Use the standard `@eliware/test` harness, which includes the coverage-gap check. Maintain 100% coverage without Istanbul ignore directives.

## Changes

Synchronize README and declarations with runtime exports. Do not bump versions, tag, publish, or push unless explicitly requested.
- Do not over-engineer simple tasks.
- Do not guess when confused.
- Do not make random, pointless changes.
- Check your own work before saying you're done.
