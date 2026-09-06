# Examples

The example demonstrates the primary `@eliware/log` workflow using placeholder
metadata only. It performs no external network calls and contains no secrets.

## Prerequisites

Use Node.js 26 or newer and install dependencies from a clean checkout:

```bash
npm ci
```

## Contents

- [`example.mjs`](example.mjs) — imports the default and named logger exports,
  creates a configured logger, and logs object, primitive, and array metadata.
- [`basic`](basic) — runs the same primary workflow from a standalone example directory.
- [Basic example documentation](basic/README.md)
- [`basic/example.mjs`](basic/example.mjs) — minimal standalone invocation.

Run it with:

```bash
node examples/example.mjs
```

The expected result is several local log lines from the example logger. Replace
only the placeholder values with non-sensitive test data.

[Back to the root README](../README.md)
