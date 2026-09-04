import { serializeArray } from '../../src/serialization/array.mjs';
import { expect, test } from '@jest/globals';

test('serializes arrays and circular references', () => {
  const array = []; array.push(array);
  expect(serializeArray(array, new Set(), new WeakSet())).toEqual(['[Circular]']);
});

test('truncates oversized arrays', () => {
  const values = Array.from({ length: 1001 }, (_, index) => index);
  expect(serializeArray(values, new Set(), new WeakSet()).at(-1)).toBe('[Truncated]');
});
