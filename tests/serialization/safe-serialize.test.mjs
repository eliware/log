import log, { log as namedLog, createLogger, safeSerialize } from '../../index.mjs';
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
  const result = makeLogger();
  const { logger } = result;
  const circular = {}; circular.self = circular;
  logger.info('values', 123);
  logger.info('null', null);
  logger.info('array', [1, 2]);
  logger.info('meta', { nil: null, nested: { id: 7, name: 'N' }, fn: function named() {}, anon: () => {}, big: 2n, circular });
  await new Promise(resolve => setImmediate(resolve));
  expect(result.output).toContain('[INFO] values');
  expect(result.output).toContain('[INFO] array');
  expect(result.output).toContain('"big":"2n"');
  logger.info('function', function named() {});
  logger.info('null-property', { nil: null });
  const shared = {}; logger.info('shared', { a: shared, b: shared });
  const noCtor = Object.create(null); logger.info('no-ctor', { noCtor });
  const idOnly = { id: 3 }; const nameOnly = { name: 'x' }; logger.info('ids', { idOnly, nameOnly });
  await new Promise(resolve => setImmediate(resolve));
  expect(logger).toBeDefined();
  expect((await Promise.resolve(logger)).info).toEqual(expect.any(Function));
});

test('covers serializer fallbacks and all levels', async () => {
  const result = makeLogger();
  const { logger } = result;
  const bad = {};
  Object.defineProperty(bad, 'bad', { enumerable: true, get() { throw new Error('bad'); } });
  const idBad = new Proxy({}, { getOwnPropertyDescriptor(target, key) { if (key === 'id') throw new Error('id'); return Reflect.getOwnPropertyDescriptor(target, key); } });
  const nameBad = new Proxy({}, { getOwnPropertyDescriptor(target, key) { if (key === 'name') throw new Error('name'); return Reflect.getOwnPropertyDescriptor(target, key); } });
  logger.info('objects', { bad, idBad, nameBad });
  for (const method of ['error', 'warn', 'debug', 'verbose', 'silly']) logger[method]('level', { x: 1 });
  logger.info('object-meta', {});
  logger.info('undefined-meta', undefined);
  await new Promise(resolve => setImmediate(resolve));
  expect(logger.info).toEqual(expect.any(Function));
  expect(logger).toBeDefined();
  expect(result.output).toContain('[INFO] objects');
  expect(result.output).toContain('[ERROR] level');
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
  const childStream = new PassThrough(); let childOutput = ''; childStream.on('data', chunk => { childOutput += chunk.toString(); });
  createLogger({ format: 'json', transports: [new winston.transports.Stream({ stream: childStream })] }).child({ requestId: 'r2' }).info('primitive', 42);
  await new Promise(resolve => setImmediate(resolve));
  expect(JSON.parse(childOutput.trim()).value).toBe(42);

  const noTimestamp = createLogger({ format: 'json', transports: [new winston.transports.Stream({ stream: new PassThrough() })] });
  expect(noTimestamp).toEqual(expect.any(Object));
});

test('supports BigInt and circular arrays in JSON output', async () => {
  const stream = new PassThrough(); let output = '';
  stream.on('data', chunk => { output += chunk.toString(); });
  const values = []; values.push(2n, values);
  const logger = createLogger({ format: 'json', transports: [new winston.transports.Stream({ stream })] });
  logger.info('safe-array', values);
  await new Promise(resolve => setImmediate(resolve));
  const record = JSON.parse(output.trim());
  expect(record.value).toEqual(['2n', '[Circular]']);
  expect(() => createLogger({ format: 'yaml', transports: [] })).toThrow('format must be text or json');
  const hostile = [];
  Object.defineProperty(hostile, 0, { enumerable: true, get() { throw new Error('array'); } });
  expect(safeSerialize(hostile)).toEqual(['[Unserializable]']);
  const proxy = new Proxy({}, { ownKeys() { throw new Error('proxy'); } });
  expect(safeSerialize(proxy)).toBe('[Unserializable]');
  expect(safeSerialize({ values: [1, 2] }).values).toEqual([1, 2]);
  expect(safeSerialize({ error: new Error('nested') }).error).toMatchObject({ message: 'nested' });
  expect(safeSerialize({ big: 2n }).big).toBe('2n');
  const badDescriptor = new Proxy({}, { getOwnPropertyDescriptor() { throw new Error('descriptor'); } });
  expect(safeSerialize({ badDescriptor }).badDescriptor).toEqual({ type: 'Object' });
  expect(safeSerialize({ value: 1 }, { has() { throw new Error('redact'); } })).toEqual({ value: '[Unserializable]' });
  expect(safeSerialize([], new Set(), { has() { throw new Error('seen'); } })).toBe('[Unserializable]');
  const badLength = new Proxy([], { get(target, key) { if (key === 'length') throw new Error('length'); return Reflect.get(target, key); } });
  expect(safeSerialize(badLength)).toBe('[Unserializable]');
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
  const badId = new Proxy({ id: 1 }, { getOwnPropertyDescriptor(target, key) { if (key === 'id') throw new Error('id'); return Reflect.getOwnPropertyDescriptor(target, key); } });
  const badName = new Proxy({ name: 'x' }, { getOwnPropertyDescriptor(target, key) { if (key === 'name') throw new Error('name'); return Reflect.getOwnPropertyDescriptor(target, key); } });
  expect(safeSerialize({ badId, badName })).toMatchObject({ badId: { type: 'Object' }, badName: { type: 'Object' } });
  expect(safeSerialize({ profile: { id: 'secret', name: 'private' } }, new Set(['id', 'name'])).profile).toEqual({ type: 'Object', id: '[REDACTED]', name: '[REDACTED]' });
  const prototypeKey = JSON.parse('{"__proto__":"secret"}');
  const safePrototype = safeSerialize(prototypeKey);
  expect(safePrototype['__proto__']).toBe('secret');
  expect(Object.getPrototypeOf(safePrototype)).toBeNull();
});

test('safeSerialize preserves arrays and redacts error fields', () => {
  expect(safeSerialize([1, { id: 2 }])).toEqual([1, { id: 2 }]);
  expect(safeSerialize([{ token: 'secret' }], new Set(['token']))).toEqual([{ token: '[REDACTED]' }]);
  const error = new Error('secret');
  expect(safeSerialize(error, new Set(['message'])).message).toBe('[REDACTED]');
  const hostile = new Error('boom');
  Object.defineProperty(hostile, 'stack', { get() { throw new Error('stack'); } });
  expect(safeSerialize(hostile).stack).toBe('[Unserializable]');
});
