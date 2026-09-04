import { safeSerialize } from './safe-serialize.mjs';

export const serializeArray = (array, redact, seen, depth = 0) => {
  if (seen.has(array)) return '[Circular]';
  seen.add(array);
  let output;
  try {
    output = [];
    for (let i = 0; i < Math.min(array.length, 1000); i++) {
      try { output[i] = safeSerialize(array[i], redact, seen, true, depth + 1); } catch { output[i] = '[Unserializable]'; }
    }
    if (array.length > 1000) output.push('[Truncated]');
  } catch { output = '[Unserializable]'; }
  finally { seen.delete(array); }
  return output;
};
