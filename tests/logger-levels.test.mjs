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

test('patches every configured Winston level', () => {
  const logger = winston.createLogger({ levels: { alpha: 0, beta: 1 }, transports: [] });
  const captured = {};
  for (const method of Object.keys(logger.levels)) logger[method] = (message, meta) => { captured[method] = { message, meta }; };
  const patched = patchLoggerLevels(logger);
  for (const method of Object.keys(logger.levels)) patched[method]('message', 1);
  expect(captured).toEqual({ alpha: { message: 'message', meta: { value: 1 } }, beta: { message: 'message', meta: { value: 1 } } });
});

test('rejects non-callable configured levels', () => {
  expect(() => patchLoggerLevels({ levels: { broken: 0 }, broken: null })).toThrow('not callable');
});

test('wraps primitive metadata when extra arguments are present', () => {
  const logger = winston.createLogger({ transports: [] });
  logger.info = (message, meta, extra) => ({ message, meta, extra });
  expect(patchLoggerLevels(logger).info('message', 42, 'extra')).toEqual({ message: 'message', meta: { value: 42 }, extra: 'extra' });
});

test('does not wrap explicitly undefined metadata', () => {
  const logger = winston.createLogger({ transports: [] });
  logger.info = (message, meta) => ({ message, meta });
  expect(patchLoggerLevels(logger).info('message', undefined)).toEqual({ message: 'message', meta: undefined });
});

test('preserves context for detached level methods', () => {
  const logger = winston.createLogger({ transports: [] });
  logger.info = function (message, meta) { return { owner: this, message, meta }; };
  const detached = patchLoggerLevels(logger).info;
  expect(detached('message', 42).owner).toBe(logger);
});
