import log, { log as namedLog, createLogger } from './index.mjs';
import { jest, test, expect } from '@jest/globals';
import { PassThrough } from 'node:stream';
import winston from 'winston';

const makeLogger = () => {
  const stream = new PassThrough();
  let output = '';
  stream.on('data', chunk => { output += chunk.toString(); });
  return { logger: createLogger({ level: 'silly', transports: [new winston.transports.Stream({ stream })] }), get output() { return output; } };
};

test('createLogger defaults and returns a logger', () => {
  expect(createLogger()).toBeDefined();
  expect(createLogger({ level: 'debug', transports: [] }).info).toEqual(expect.any(Function));
});

test('exports refer to the configured logger', () => {
  expect(namedLog).toBe(log);
  const spy = jest.spyOn(console._stdout, 'write').mockImplementation(() => {});
  log.info('default');
  namedLog.info('named', { foo: 'bar' });
  spy.mockRestore();
});

test('formats primitive, null, array, object, function, bigint and circular metadata', async () => {
  const { logger, output } = makeLogger();
  const circular = {}; circular.self = circular;
  logger.info('values', 123);
  logger.info('null', null);
  logger.info('array', [1, 2]);
  logger.info('meta', { nil: null, nested: { id: 7, name: 'N' }, fn: function named() {}, anon: () => {}, big: 2n, circular });
  await new Promise(resolve => setImmediate(resolve));
  logger.info('function', function named() {});
  logger.info('null-property', { nil: null });
  const shared = {}; logger.info('shared', { a: shared, b: shared });
  const noCtor = Object.create(null); logger.info('no-ctor', { noCtor });
  const idOnly = { id: 3 }; const nameOnly = { name: 'x' }; logger.info('ids', { idOnly, nameOnly });
  expect(logger).toBeDefined();
});

test('covers serializer fallbacks and all levels', () => {
  const { logger } = makeLogger();
  const bad = {};
  Object.defineProperty(bad, 'bad', { enumerable: true, get() { throw new Error('bad'); } });
  const idBad = new Proxy({}, { has() { throw new Error('id'); } });
  const nameBad = new Proxy({}, { has() { throw new Error('name'); } });
  logger.info('objects', { bad, idBad, nameBad });
  for (const method of ['error', 'warn', 'debug', 'verbose', 'silly']) logger[method]('level', { x: 1 });
  logger.info('object-meta', {});
  logger.info('undefined-meta', undefined);
  expect(logger.info).toEqual(expect.any(Function));
});
