import { jsonFormat } from '../../src/formats/json.mjs';
import { expect, test } from '@jest/globals';
import { PassThrough } from 'node:stream';
import winston from 'winston';

test('emits JSON metadata with redaction and timestamps', async () => {
  const stream = new PassThrough(); let output = '';
  stream.on('data', chunk => { output += chunk.toString(); });
  const logger = winston.createLogger({ format: jsonFormat(new Set(['token']), true), transports: [new winston.transports.Stream({ stream })] });
  logger.info('hello', { token: 'secret', visible: true });
  await new Promise(resolve => setImmediate(resolve));
  const record = JSON.parse(output.trim());
  expect(record.token).toBe('[REDACTED]');
  expect(record.visible).toBe(true);
  expect(record.timestamp).toBeDefined();
});
