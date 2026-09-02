import { createLogger } from '../src/create-logger.mjs';
import { expect, test } from '@jest/globals';

test('creates an injectable logger', () => {
  expect(createLogger({ transports: [] }).info).toEqual(expect.any(Function));
});
