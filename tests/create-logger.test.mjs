import { createLogger } from '../src/create-logger.mjs';
import { expect, test } from '@jest/globals';
import { PassThrough } from 'node:stream';
import winston from 'winston';

test('creates an injectable logger', () => {
  expect(createLogger({ transports: [] }).info).toEqual(expect.any(Function));
});

test('configures JSON output and redaction', async () => {
  const stream = new PassThrough(); let output = '';
  stream.on('data', chunk => { output += chunk.toString(); });
  createLogger({ format: 'json', redactKeys: ['secret'], transports: [new winston.transports.Stream({ stream })] }).info('message', { secret: 'hidden' });
  await new Promise(resolve => setImmediate(resolve));
  expect(JSON.parse(output.trim()).secret).toBe('[REDACTED]');
});

test('rejects malformed redaction configuration', () => {
  expect(() => createLogger({ redactKeys: null, transports: [] })).toThrow('redactKeys');
});

test('rejects an invalid configured level', () => {
  expect(() => createLogger({ level: 'not-a-winston-level', transports: [] })).toThrow('Unknown logger level');
});
