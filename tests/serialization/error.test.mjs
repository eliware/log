import { serializeError } from '../../src/serialization/error.mjs';
import { expect, test } from '@jest/globals';

test('serializes error fields', () => {
  expect(serializeError(new Error('boom'), new Set(), new WeakSet()).message).toBe('boom');
});
