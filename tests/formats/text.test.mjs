import { textFormat } from '../../src/formats/text.mjs';
import { expect, test } from '@jest/globals';

test('formats text messages and metadata', () => {
  expect(textFormat(new Set())({ level: 'info', message: 'hello', value: 2 })).toContain('[INFO] hello');
});

test('uses safe fallbacks for malformed records', () => {
  expect(textFormat(new Set())({ level: null, message: undefined })).toBe('[INFO] ');
  const original = JSON.stringify;
  JSON.stringify = () => { throw new Error('stringify'); };
  try {
    expect(textFormat(new Set())({ level: 'info', message: 'hello', value: 2 })).toBe('[INFO] hello [Unserializable]');
  } finally {
    JSON.stringify = original;
  }
});
