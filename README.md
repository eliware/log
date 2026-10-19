# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/log [![npm](https://img.shields.io/npm/v/@eliware/log)](https://www.npmjs.com/package/@eliware/log) [![License](https://img.shields.io/github/license/eliware/log)](https://github.com/eliware/log/blob/main/LICENSE) [![CI](https://github.com/eliware/log/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/log/actions/workflows/ci.yaml)

Structured ESM logging for Node.js with redaction and defensive serialization, backed by Winston.

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

Read the [documentation](docs/README.md) and [specifications](specs/README.md).

## Requirements

Use Node.js 26 or later in a native ESM project.

## Setup

Install the package with npm:

```sh
npm install @eliware/log
```

## Usage

Import `createLogger()` from the package root to create a logger:

```js
import { createLogger } from "@eliware/log";

const logger = createLogger({ format: "json" });
logger.info("Request received", { requestId: "demo" });
```

Read the [release notes](RELEASE_NOTES.md) for package changes.

## Development

Run `npm ci` to install the lockfile dependencies.

## Testing

Run `npm test` for aggregate validation. Run `npm run lint`, `npm run audit`, `npm run format:check`, `npm run typecheck`, or `npm run pack` for focused checks. Run `npm run format` to format files.

## Troubleshooting

## Security

## API

Import `createLogger`, `safeSerialize`, the named `log`, and the default logger from the package root. Read the [API reference](docs/api-reference.md) for options, declarations, and methods.

## Packaging

The package includes `package.json` and the files listed in `package.json.files`: `src/`, `docs/`, `README.md`, `AGENTS.md`, `LICENSE`, `RELEASE_NOTES.md`, `examples/`, `specs/`, and `.env.example`.
Use numeric `MAJOR.MINOR.PATCH` versions and matching `v<version>` release tags.
Get approval through the Operations release handoff before publication.

## Examples

Read [examples/README.md](examples/README.md) for commands and expected results.

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
