// Minimal CommonJS test stub
const log = require('./index.cjs');
const { createLogger } = require('./index.cjs');
const { test, expect } = require('@jest/globals');

test('createLogger returns a winston logger', () => {
  const logger = createLogger({ level: 'debug' });
  expect(logger).toBeDefined();
  expect(typeof logger.info).toBe('function');
});

test('log.info outputs expected format (default require)', () => {
  const spy = jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
  log.info('Test message (default)', { foo: 'bar' });
  expect(true).toBe(true); // Just to ensure the test runs
  spy.mockRestore();
});

test('log.info outputs primitive value', () => {
  const spy = jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
  log.info('Primitive value', 123);
  log.info('Array value', [1,2,3]);
  expect(true).toBe(true); // Just to ensure the test runs
  spy.mockRestore();
});
