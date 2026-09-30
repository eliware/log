# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/log [![npm version](https://img.shields.io/npm/v/@eliware/log.svg)](https://www.npmjs.com/package/@eliware/log) [![license](https://img.shields.io/github/license/eliware/log.svg)](LICENSE) [![CI](https://github.com/eliware/log/actions/workflows/ci.yml/badge.svg)](https://github.com/eliware/log/actions/workflows/ci.yml)

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [API](#api)
- [Packaging](#packaging)
- [Examples](#examples)
- [Support](#support)
- [License](#license)
- [Links](#links)

## Features

Purpose: @eliware/log provides structured logging with redaction and defensive serialization for Node.js applications.

The package description is: Structured, secure ESM logging for Node.js with redaction and defensive serialization, backed by Winston.

- Provides a small, tested native ESM library surface.
- Includes public declarations, examples, documentation, and release notes.
- Uses shared validation scripts and an explicit package contents allowlist.

Maintained by Eliware <eliware@eliware.org>. Author: Eliware <eliware@eliware.org>. License: MIT. See [LICENSE](LICENSE).

Documentation: [docs](docs/README.md) · [specifications](specs/README.md) · [examples](examples/README.md)

## Requirements

- Node.js 26.x with native ESM support.
- No environment variables or runtime configuration files are required.

## Setup

Run npm install @eliware/log to install the package. This checkout declares version 9.0.0 in package.json; verify the currently published version in the npm registry. The runtime entrypoint is src/index.mjs and declarations are in index.d.ts.

### Configuration

The logger has no environment-variable or configuration-file settings. Configure `createLogger` with supported options: `level`, `transports`, `format` (`text` or `json`), `timestamp`, and `keys` for metadata redaction. The `safeSerialize` helper accepts redaction options supported by `@eliware/redact`. These API options are runtime configuration; package metadata and deployment settings are not.

## Usage

Create a logger and write a local message:

```js
import { createLogger } from "@eliware/log";
const logger = createLogger({ format: "json", timestamp: true });
logger.info("Example", { requestId: "demo" });
```

Prerequisites: Node.js 26 and an ESM project with @eliware/log installed.
Command: node examples/basic/example.mjs.
Expected result: one local info log line with placeholder metadata.
The package entrypoint is src/index.mjs; public declarations are in index.d.ts. The package version is 9.0.0 in package.json; verify its release in the npm registry.

## Development

Read AGENTS.md, docs/README.md, and specs/README.md before changing the logger contract. Implementation is under src/ and mirrored tests are under tests/. Use npm ci to install the lockfile.

## Testing

Run `npm test` for aggregate validation and coverage. Use `npm run lint`, `npm run audit`, `npm run format:check`, `npm run typecheck`, and `npm run pack` for the applicable focused checks. `npm run format` writes formatted files; `npm run format:check` is read-only.

## Troubleshooting

Use Node.js 26. Internal src modules are not separately exported. Unsupported logger options fail clearly; consult the specifications and safety guide.

## Security

Redaction and defensive serialization reduce exposure but do not guarantee that unknown sensitive values are detected. Do not send secrets to a logger or include them in source, tests, examples, or issue reports.

## API

The package exports createLogger(options), a default logger, named log, and safeSerialize. Logger options include level, transports, format (text or json), timestamp, and redaction keys. TypeScript declarations are in index.d.ts.

## Packaging

The intentional package allowlist is src/, index.d.ts, README.md, docs/, examples/, specs/, LICENSE, and RELEASE_NOTES.md.

Validate packed contents with npm run pack; the shared pack check must pass and the packed files must match the allowlist before release consideration.

Public publication uses npm provenance and an exact version tag matching package.json after Ubuntu validation. Verify the exact version in the npm registry after an explicitly authorized publication handoff.

## Examples

Runnable examples and prerequisites are indexed in examples/README.md. Start with the basic example, which uses placeholder metadata and no external I/O.

## Support

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

Use the [Eliware Discord community](https://discord.gg/M6aTR9eTwN), [GitHub issues](https://github.com/eliware/log/issues), or [eliware@eliware.org](mailto:eliware@eliware.org). Include relevant logger options and redacted diagnostics; do not include secrets.

## License

MIT. See [LICENSE](LICENSE).

## Links

- [Eliware home](https://eliware.org)
- [Eliware GitHub organization](https://github.com/eliware)
- [GitHub repository](https://github.com/eliware/log)
- [npm package](https://www.npmjs.com/package/@eliware/log)
- [Documentation](docs/README.md)
- [Specifications](specs/README.md)
- [Canonical repository profile specifications](https://github.com/eliware/test/blob/main/specs/conventions/README.md)
- [Runnable examples](examples/README.md)
- [Release notes](RELEASE_NOTES.md)
