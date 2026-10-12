# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/log [![npm](https://img.shields.io/npm/v/@eliware/log)](https://www.npmjs.com/package/@eliware/log) [![License](https://img.shields.io/github/license/eliware/log)](https://github.com/eliware/log/blob/main/LICENSE) [![CI](https://github.com/eliware/log/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/log/actions/workflows/ci.yaml)

Structured, secure ESM logging for Node.js with redaction and defensive serialization, backed by Winston.

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
- [Links](#links)
- [License](#license)

## Features

`@eliware/log` provides structured logging for Node.js. It supports metadata redaction and defensive serialization.

- Use `createLogger()` to create a Winston logger.
- Import the default `log` logger or the named `log` export.
- Use `safeSerialize()` to serialize values safely.
- Configure text or JSON output, timestamps, transports, and redaction keys.

See [documentation](docs/README.md), [specifications](specs/README.md), and [examples](examples/README.md).

## Requirements

- Use Node.js 26 or later.
- Use a native ESM project.
- Configure the logger in application code. The package has no required environment variables.

## Setup

Install the package with npm:

```bash
npm install @eliware/log
```

The package version is `12.0.0`. Check the [npm package](https://www.npmjs.com/package/@eliware/log) for the published version.

## Usage

Create a logger and write a message with metadata:

```js
import { createLogger } from "@eliware/log";

const logger = createLogger({ format: "json", timestamp: true });
logger.info("Example", { requestId: "demo" });
```

Prerequisites: Node.js 26 and an ESM project with `@eliware/log` installed.
Command: `node examples/basic/example.mjs`.
Expected result: one local info log line with placeholder metadata.

See [release notes](RELEASE_NOTES.md) for package changes.

## Development

Read [AGENTS.md](AGENTS.md), [documentation index](docs/README.md), and [specification index](specs/README.md) before you change the logger contract.
Source modules live under `src/`. Matching tests live under `tests/`.
Run `npm ci` to install the lockfile dependencies.

## Testing

Run `npm test` for aggregate validation, coverage, lint, format, audit, type, and package checks.
Run `npm run lint`, `npm run audit`, `npm run format:check`, `npm run typecheck`, or `npm run pack` for focused checks.
Run `npm run format` to write formatted files. Use `npm run format:check` for a read-only check.

## Troubleshooting

Use Node.js 26 or later. Internal source modules are not public package exports.
Invalid logger options raise a `TypeError`. Check the [configuration guide](docs/configuration.md) and [safety guide](docs/safety-and-troubleshooting.md).

## Security

Do not log credentials, access tokens, private keys, or other sensitive values.
Set `keys` for known sensitive metadata. Redaction does not detect every sensitive value.
Review custom Winston transports before use.

## API

The package exports `createLogger(options)`, `safeSerialize(value, options)`, a default logger, and named `log`.
Logger options include `level`, `transports`, `format`, `timestamp`, and `keys`.
Type declarations are in `src/index.d.ts`.

## Packaging

The package includes `src/`, `docs/`, `README.md`, `AGENTS.md`, `LICENSE`, `RELEASE_NOTES.md`, `examples/`, `specs/`, and `.env.example`.
Run `npm run pack` to check package contents.
Publication requires the Operations release handoff. The repository does not grant publication authority.

## Examples

Read [examples/README.md](examples/README.md) for prerequisites, commands, and expected results.
Start with [the basic example](examples/basic/README.md). It uses placeholder metadata and makes no external requests.

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## Links

- [Home Page](https://eliware.org)
- [GitHub Org](https://github.com/eliware)
- [GitHub Repo](https://github.com/eliware/log)
- [Bug Reports](https://github.com/eliware/log/issues)
- [npm](https://www.npmjs.com/package/@eliware/log)
- [Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eliware](LICENSE)
