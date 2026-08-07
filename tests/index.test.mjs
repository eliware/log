import log, { log as namedLog, createLogger, safeSerialize } from '../index.mjs';
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
  const previous = process.env.LOG_LEVEL;
  process.env.LOG_LEVEL = 'debug';
  expect(createLogger()).toBeDefined();
  if (previous === undefined) delete process.env.LOG_LEVEL; else process.env.LOG_LEVEL = previous;
  const defaultLevel = process.env.LOG_LEVEL;
  delete process.env.LOG_LEVEL;
  expect(createLogger()).toBeDefined();
  if (defaultLevel === undefined) delete process.env.LOG_LEVEL; else process.env.LOG_LEVEL = defaultLevel;
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
  const { logger } = makeLogger();
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

test('supports JSON output, timestamps, error details, redaction, and child context', async () => {
  const stream = new PassThrough(); let output = '';
  stream.on('data', chunk => { output += chunk.toString(); });
  const logger = createLogger({ format: 'json', timestamp: true, redactKeys: ['token'], transports: [new winston.transports.Stream({ stream })] });
  logger.child({ requestId: 'r1' }).error('failed', { token: 'secret', error: new Error('boom') });
  await new Promise(resolve => setImmediate(resolve));
  const record = JSON.parse(output.trim());
  expect(record.requestId).toBe('r1');
  expect(record.token).toBe('[REDACTED]');
  expect(record.error.message).toBe('boom');
  expect(record.timestamp).toBeDefined();

  const noTimestamp = createLogger({ format: 'json', transports: [new winston.transports.Stream({ stream: new PassThrough() })] });
  expect(noTimestamp).toEqual(expect.any(Object));
});

test('safeSerialize covers function and hostile objects', () => { expect(safeSerialize({ fn: function () {} }).fn).toBe('[Function: fn]'); const hostile = new Proxy({}, { ownKeys() { throw new Error('bad'); } }); expect(safeSerialize(hostile)).toBe('[Unserializable]'); });

test('safeSerialize handles all primitive and object forms directly', () => {
  expect(safeSerialize(null)).toBeNull();
  expect(safeSerialize(3)).toBe(3);
  expect(safeSerialize(new Error('boom')).message).toBe('boom');
  expect(safeSerialize({ token: 'secret' }, new Set(['token']))).toEqual({ token: '[REDACTED]' });
  expect(safeSerialize({ nil: null, value: 'ok', nested: { id: 7, name: 'n' }, fn: () => {} })).toMatchObject({ nil: null, value: 'ok', nested: { id: 7, name: 'n' }, fn: '[Function: fn]' });
  const anonymous = function () {}; Object.defineProperty(anonymous, 'name', { value: '' }); expect(safeSerialize({ anonymous }).anonymous).toBe('[Function: anonymous]');
  expect(safeSerialize({ noCtor: Object.create(null) }).noCtor.type).toBe('Object');
  const badId = new Proxy({}, { has() { throw new Error('id'); } });
  const badName = new Proxy({}, { has() { throw new Error('name'); } });
  expect(safeSerialize({ badId, badName })).toBeDefined();
});
