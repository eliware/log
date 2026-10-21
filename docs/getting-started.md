# Start Here

Use this guide to add `@eliware/log` to a Node.js application.

## Requirements

- Use Node.js 26 or later.
- Use native ECMAScript modules (ESM).
- Use npm to install the package.

The package has no environment variables or configuration files.
Set logger options in application code.

## Install

Run this command in your project folder:

```sh
npm install @eliware/log
```

Set `"type": "module"` in your package file if your project does not use ESM by default.

## Create a logger

Import `createLogger()` and set the output format:

```js
import { createLogger } from "@eliware/log";

const logger = createLogger({ format: "json", timestamp: true });
logger.info("Request received", { requestId: "demo" });
```

The logger uses the console transport by default.
It writes one JSON record with a timestamp and the request ID.

## Run the basic example

From the repository root, install dependencies:

```sh
npm ci
```

Run the basic example:

```sh
node examples/basic/example.mjs
```

The example writes one info record with placeholder metadata.
It does not send data to a remote system.

## Select an entry point

Import `createLogger` to make a logger with custom options.
Import the default `log` value or named `log` value to use the default logger.
Import `safeSerialize` to create a safe representation of a value.
Import the Redact functions to redact structured values, headers, or text.

```js
import log, {
  createLogger,
  log as namedLog,
  redactHeaders,
  redactText,
  redactValue,
  replaceLiteralSecret,
  safeSerialize,
} from "@eliware/log";
```

The default and named `log` values refer to the same logger.
See [Configure a logger](configuration.md) to set options.
See [Write logs](write-logs.md) to set messages and metadata.
See the [API reference](api-reference.md) for the redaction functions and option types.
