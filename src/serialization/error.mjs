import { safeSerialize } from './safe-serialize.mjs';

export const serializeError = (error, redact, seen) => {
  const output = {};
  for (const key of ['name', 'message', 'stack']) {
    if (redact.has(key)) {
      output[key] = '[REDACTED]';
      continue;
    }
    try { output[key] = safeSerialize(error[key], redact, seen); } catch { output[key] = '[Unserializable]'; }
  }
  return output;
};
