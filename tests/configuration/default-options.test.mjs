import { createDefaultTransports } from '../../src/configuration/default-options.mjs';
import { expect, test } from '@jest/globals';

test('creates the default console transport lazily', () => {
  expect(createDefaultTransports()).toHaveLength(1);
});
