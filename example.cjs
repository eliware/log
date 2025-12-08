// Example usage for CommonJS
const log = require('@eliware/log');
log.info('Hello from example.cjs (default require)', { foo: 'bar' });
log.info('Primitive value', 42); // NEW: primitive value
log.info('Array value', [1,2,3]); // NEW: array value

const namedLog = require('@eliware/log');
namedLog.info('Hello from example.cjs (named require)', { foo: 'bar' });
namedLog.info('Primitive value', 'test'); // NEW: primitive value

const { createLogger } = require('@eliware/log');
const customLogger = createLogger({ level: 'debug' });
customLogger.debug('Custom logger debug message', { custom: true });
customLogger.debug('Primitive debug', true); // NEW: primitive value
