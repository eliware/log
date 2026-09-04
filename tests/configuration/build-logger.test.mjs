import { buildLogger } from '../../src/configuration/build-logger.mjs';
import { expect, test } from '@jest/globals';

test('builds a Winston logger from normalized options', () => {
  expect(buildLogger({ level: 'info', transports: [], format: 'text', timestamp: false, redact: new Set() }).info).toEqual(expect.any(Function));
});
