// Example usage for ESM
import log, { log as namedLog, createLogger } from '@eliware/log';

log.info('Hello from example.mjs (default import)', { foo: 'bar' });
log.info('Primitive value', 42); // NEW: primitive value
log.info('Array value', [1,2,3]); // NEW: array value

namedLog.info('Hello from example.mjs (named import)', { foo: 'bar' });
namedLog.info('Primitive value', 'test'); // NEW: primitive value

const customLogger = createLogger({ level: 'debug' });
customLogger.debug('Custom logger debug message', { custom: true });
customLogger.debug('Primitive debug', true); // NEW: primitive value
