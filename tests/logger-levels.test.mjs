import winston from 'winston';
import { patchLoggerLevels } from '../src/logger-levels.mjs';
import { expect, test } from '@jest/globals';

test('patches logger methods to wrap primitive metadata', () => {
  const logger = winston.createLogger({ transports: [] });
  const info = logger.info;
  logger.info = function (message, meta) { this.captured = { message, meta }; };
  patchLoggerLevels(logger).info('message', 42);
  expect(logger.captured).toEqual({ message: 'message', meta: { value: 42 } });
  logger.info = info;
});
