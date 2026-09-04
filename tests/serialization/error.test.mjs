import { serializeError } from '../../src/serialization/error.mjs';
import { expect, test } from '@jest/globals';

test('serializes error fields', () => {
  expect(serializeError(new Error('boom'), new Set(), new WeakSet()).message).toBe('boom');
});

test('falls back when error redaction infrastructure fails', () => {
  const redact = { has() { throw new Error('redaction'); } };
  expect(serializeError(new Error('boom'), redact, new WeakSet())).toEqual({ name: '[Unserializable]', message: '[Unserializable]', stack: '[Unserializable]' });
});
