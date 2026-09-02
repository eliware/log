import { textFormat } from '../../src/formats/text.mjs';
import { expect, test } from '@jest/globals';

test('formats text messages and metadata', () => {
  expect(textFormat(new Set())({ level: 'info', message: 'hello', value: 2 })).toContain('[INFO] hello');
});
