import { normalizeLoggerOptions } from '../../src/configuration/normalize-options.mjs';
import { expect, test } from '@jest/globals';

test('normalizes logger options and passes redaction policy through', () => {
  const transports = [];
  const result = normalizeLoggerOptions({ level: 'info', transports, format: 'text', timestamp: false, redactKeys: ['Token', 7] });
  expect(result).toMatchObject({ level: 'info', transports, format: 'text', timestamp: false });
  expect(result.redact).toEqual({ keys: ['Token', 7] });
});

test('rejects invalid format and transports', () => {
  expect(() => normalizeLoggerOptions({ level: 'info', transports: [], format: 'xml', timestamp: false, redactKeys: [] })).toThrow('format');
  expect(() => normalizeLoggerOptions({ level: 'info', transports: 'invalid', format: 'text', timestamp: false, redactKeys: [] })).toThrow('transports');
  expect(() => normalizeLoggerOptions({ level: 'invalid', transports: [], format: 'text', timestamp: false, redactKeys: [] })).toThrow('level');
});

test('handles omitted redaction keys', () => {
  expect(normalizeLoggerOptions({ level: 'info', transports: [], format: 'text', timestamp: false }).redact).toEqual({ keys: [] });
  expect(() => normalizeLoggerOptions({ level: 'info', transports: [], format: 'text', timestamp: false, redactKeys: null })).toThrow('redactKeys');
});
