import { serializeError } from './error.mjs';
import { serializeArray } from './array.mjs';

const serializeValue = (value, redact = new Set(), seen = new WeakSet()) => {
  if (value === null) return null;
  if (typeof value === 'bigint') return value.toString() + 'n';
  if (value instanceof Error) return serializeError(value, redact, seen);
  if (typeof value !== 'object') return value;
  if (Array.isArray(value)) return serializeArray(value, redact, seen);
  try {
    const output = Object.create(null);
    for (const key of Object.keys(value)) {
      try {
        if (redact.has(key.toLowerCase())) { output[key] = '[REDACTED]'; continue; }
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (!descriptor || !('value' in descriptor)) { output[key] = '[Unserializable]'; continue; }
        const child = descriptor.value;
        if (child === null) output[key] = null;
        else if (child instanceof Error) output[key] = safeSerialize(child, redact, seen);
        else if (Array.isArray(child)) output[key] = safeSerialize(child, redact, seen);
        else if (typeof child === 'object') {
          const info = { type: 'Object' };
          try {
            const id = Object.getOwnPropertyDescriptor(child, 'id')?.value;
            if (typeof id === 'string' || typeof id === 'number') info.id = redact.has('id') ? '[REDACTED]' : id;
          } catch {}
          try {
            const name = Object.getOwnPropertyDescriptor(child, 'name')?.value;
            if (typeof name === 'string') info.name = redact.has('name') ? '[REDACTED]' : name;
          } catch {}
          output[key] = info;
        } else if (typeof child === 'bigint') output[key] = child.toString() + 'n';
        else if (typeof child === 'function') output[key] = `[Function: ${child.name || 'anonymous'}]`;
        else output[key] = child;
      } catch { output[key] = '[Unserializable]'; }
    }
    return output;
  } catch { return '[Unserializable]'; }
};

export const safeSerialize = (value, redact = new Set(), seen = new WeakSet()) => {
  try { return serializeValue(value, redact, seen); } catch { return '[Unserializable]'; }
};
