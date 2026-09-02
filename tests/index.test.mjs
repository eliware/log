import log, { log as namedLog, createLogger, safeSerialize } from '../index.mjs';
import { expect, test } from '@jest/globals';

test('exposes the stable public API', () => {
  expect(log).toBe(namedLog);
  expect(log.info).toEqual(expect.any(Function));
  expect(createLogger).toEqual(expect.any(Function));
  expect(safeSerialize).toEqual(expect.any(Function));
});
