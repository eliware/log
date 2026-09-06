# Requirements

## Public API

The package MUST provide default and named `log` exports, `createLogger()`, and
the public `safeSerialize` export. It MUST remain native ESM and expose its
TypeScript declarations through the package exports map.

## Logger behavior

`createLogger()` MUST support configurable levels, injectable Winston
transports, text and JSON formats, optional timestamps, child logger context,
and primitive or array metadata. Invalid format, transport, and level options
MUST fail clearly.

## Safety

Sensitive metadata MUST be redacted through `redactKeys`. Error values,
BigInts, primitives, arrays, circular values, and hostile values MUST be
handled without leaking secrets or crashing the logger. Importing the package
MUST NOT perform external I/O.
