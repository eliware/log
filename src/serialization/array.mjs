import { safeSerialize } from './safe-serialize.mjs';

export const serializeArray = (array, redact, seen) => {
  if (seen.has(array)) return '[Circular]';
  seen.add(array);
  let output;
  try {
    output = [];
    for (let i = 0; i < array.length; i++) {
      try { output[i] = safeSerialize(array[i], redact, seen); } catch { output[i] = '[Unserializable]'; }
    }
  } catch { output = '[Unserializable]'; }
  seen.delete(array);
  return output;
};
