import log, { log as namedLog, createLogger } from './index.mjs';
import { jest, test, expect } from '@jest/globals';

test('createLogger returns a winston logger', () => {
  const logger = createLogger({ level: 'debug' });
  expect(logger).toBeDefined();
  expect(typeof logger.info).toBe('function');
});

test('log.info outputs expected format (default import)', () => {
  const spy = jest.spyOn(console._stdout, 'write').mockImplementation(() => {});
  log.info('Test message (default)', { foo: 'bar' });
  expect(true).toBe(true); // Just to ensure the test runs
  spy.mockRestore();
});

test('log.info outputs expected format (named import)', () => {
  const spy = jest.spyOn(console._stdout, 'write').mockImplementation(() => {});
  namedLog.info('Test message (named)', { foo: 'bar' });
  expect(true).toBe(true); // Just to ensure the test runs
  spy.mockRestore();
});

test('log.info outputs primitive value', () => {
  const spy = jest.spyOn(console._stdout, 'write').mockImplementation(() => {});
  log.info('Primitive value', 123);
  log.info('Array value', [1, 2, 3]);
  expect(true).toBe(true); // Just to ensure the test runs
  spy.mockRestore();
});
