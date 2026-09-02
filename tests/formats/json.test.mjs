import { jsonFormat } from '../../src/formats/json.mjs';
import { expect, test } from '@jest/globals';

test('creates JSON format with optional timestamp', () => {
  expect(jsonFormat(new Set(), true)).toEqual(expect.any(Object));
});
