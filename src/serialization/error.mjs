import { safeSerialize } from './safe-serialize.mjs';

export const serializeError = (error, redact, seen) => {
  const output = {};
  try {
    for (const key of ['name', 'message', 'stack']) {
      if (redact.has(key)) {
        output[key] = '[REDACTED]';
        continue;
      }
      try { output[key] = safeSerialize(error[key], redact, seen, true, 1); } catch { output[key] = '[Unserializable]'; }
    }
  } catch {
    return { name: '[Unserializable]', message: '[Unserializable]', stack: '[Unserializable]' };
  }
  return output;
};
