# AGENTS.md

## Project

`@eliware/log` is an ESM logging library backed by Winston, with structured output, child loggers, serialization, and metadata redaction.

## API and security

- Preserve default/named logger exports and `createLogger()` behavior.
- Keep Error, BigInt, primitive, array, context, timestamp, and redaction behavior covered.
- Never expose secrets through logs; use `redactKeys` for sensitive metadata.
- Keep custom transports injectable and avoid external I/O during import.

## Validation

Run `npm test`, `npm run test:gaps`, `npm run lint`, `npm run typecheck`, and `npm run pack`. Maintain 100% coverage without Istanbul ignore directives.

## Changes

Synchronize README and declarations with runtime exports. Do not bump versions, tag, publish, or push unless explicitly requested.
