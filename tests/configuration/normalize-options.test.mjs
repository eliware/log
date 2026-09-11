import { normalizeLoggerOptions } from '../../src/configuration/normalize-options.mjs';
import { expect, test } from '@jest/globals';

test('normalizes logger options and passes redaction policy through', () => {
  const transports = [];
  const result = normalizeLoggerOptions({ level: 'info', transports, format: 'text', timestamp: false, keys: ['Token', 'authorization'] });
  expect(result).toMatchObject({ level: 'info', transports, format: 'text', timestamp: false });
  expect(result.redact).toEqual({ keys: ['Token', 'authorization'] });
});

test('rejects invalid format and transports', () => {
  expect(() => normalizeLoggerOptions({ level: 'info', transports: [], format: 'xml', timestamp: false, keys: [] })).toThrow('format');
  expect(() => normalizeLoggerOptions({ level: 'info', transports: 'invalid', format: 'text', timestamp: false, keys: [] })).toThrow('transports');
  expect(() => normalizeLoggerOptions({ level: 'invalid', transports: [], format: 'text', timestamp: false, keys: [] })).toThrow('level');
});

test('rejects non-string redaction keys', () => {
  expect(() => normalizeLoggerOptions({ level: 'info', transports: [], format: 'text', timestamp: false, keys: ['token', 7] })).toThrow('keys must contain only strings');
});

test('handles omitted redaction keys', () => {
  expect(normalizeLoggerOptions({ level: 'info', transports: [], format: 'text', timestamp: false }).redact).toEqual({ keys: [] });
  expect(() => normalizeLoggerOptions({ level: 'info', transports: [], format: 'text', timestamp: false, keys: null })).toThrow('keys');
});
