import { serializeArray } from '../../src/serialization/array.mjs';
import { expect, test } from '@jest/globals';

test('serializes arrays and circular references', () => {
  const array = []; array.push(array);
  expect(serializeArray(array, new Set(), new WeakSet())).toEqual(['[Circular]']);
});
