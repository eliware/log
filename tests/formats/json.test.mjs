import { jsonFormat } from '../../src/formats/json.mjs';
import { expect, test } from '@jest/globals';
import { PassThrough } from 'node:stream';
import winston from 'winston';

test('emits JSON metadata with redaction and timestamps', async () => {
  const stream = new PassThrough(); let output = '';
  stream.on('data', chunk => { output += chunk.toString(); });
  const logger = winston.createLogger({ format: jsonFormat({ keys: ['token'] }, true), transports: [new winston.transports.Stream({ stream })] });
  logger.info('hello', { token: 'secret', visible: true });
  await new Promise(resolve => setImmediate(resolve));
  const record = JSON.parse(output.trim());
  expect(record.token).toBe('[REDACTED]');
  expect(record.visible).toBe(true);
  expect(record.timestamp).toBeDefined();
});

test('uses a safe fallback when JSON output serialization fails', () => {
  const original = JSON.stringify;
  JSON.stringify = () => { throw new Error('stringify'); };
  try {
    const format = jsonFormat({ keys: [] }, false);
    const result = format.transform({ level: 'info', message: 'hello' });
    expect(result[Symbol.for('message')]).toBe('{"message":"[Unserializable]"}');
  } finally {
    JSON.stringify = original;
  }
});

test('formats records without a timestamp', () => {
  const format = jsonFormat({ keys: [] }, false);
  const result = format.transform({ level: 'info', message: 'hello' });
  expect(JSON.parse(result[Symbol.for('message')])).toMatchObject({ level: 'info', message: 'hello' });
});

test('defensively serializes non-string messages without applying metadata redaction', () => {
  const format = jsonFormat({ keys: ['token'] }, false);
  const circular = {};
  circular.self = circular;
  const result = format.transform({ level: 'info', message: { error: new Error('boom'), big: 2n, circular, token: 'message-token' }, token: 'secret' });
  const record = JSON.parse(result[Symbol.for('message')]);
  expect(record.message.error.message).toBe('boom');
  expect(record.message.big).toBe('2n');
  expect(record.message.circular.self).toBe('[CIRCULAR]');
  expect(record.message.token).toBe('message-token');
  expect(record.token).toBe('[REDACTED]');
});

test('preserves own prototype-named metadata safely', () => {
  const format = jsonFormat({ keys: [] }, false);
  const metadata = JSON.parse('{"__proto__":"safe"}');
  const result = format.transform({ level: 'info', message: 'hello', metadata });
  expect(JSON.parse(result[Symbol.for('message')]).metadata.__proto__).toBe('safe');
});
