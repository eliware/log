# Configuration

Create a logger with `createLogger()` and inject transports when an application
needs a destination other than the default console transport.

```js
import winston from 'winston';
import { createLogger } from '@eliware/log';

const logger = createLogger({
  level: 'info',
  format: 'json',
  timestamp: true,
  keys: ['authorization', 'token'],
  transports: [new winston.transports.Console()]
});
```

Supported options are `level`, `transports`, `format` (`text` or `json`),
`timestamp`, and `keys`. Redaction and defensive serialization are
provided by `@eliware/redact`; keys are matched case-insensitively through
nested metadata and arrays.

The package is native ESM and requires Node.js 26 or newer. There are no
required environment variables; configuration belongs in application code or
the application's own environment contract.
