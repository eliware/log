import { textFormat } from '../../src/formats/text.mjs';
import { expect, test } from '@jest/globals';

test('formats text messages and metadata', () => {
  expect(textFormat({ keys: [] })({ level: 'info', message: 'hello', value: 2 })).toContain('[INFO] hello');
});

test('uses safe fallbacks for malformed records', () => {
  expect(textFormat({ keys: [] })({ level: null, message: undefined })).toContain('[INFO]');
  const original = JSON.stringify;
  JSON.stringify = () => { throw new Error('stringify'); };
  try {
    expect(textFormat({ keys: [] })({ level: 'info', message: 'hello', value: 2 })).toBe('[INFO] hello [Unserializable]');
    expect(textFormat({ keys: [] })({ level: 'info', message: { value: 2 } })).toBe('[INFO] [Unserializable]');
  } finally {
    JSON.stringify = original;
  }
});
