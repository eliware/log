import { serializeError } from './error.mjs';
import { serializeArray } from './array.mjs';

const MAX_DEPTH = 20;
const MAX_KEYS = 1000;

const serializeValue = (value, redact = new Set(), seen = new WeakSet(), depth = 0) => {
  if (value === null) return null;
  if (value === undefined) return '[Undefined]';
  if (typeof value === 'symbol') return `[Symbol: ${value.description ?? ''}]`;
  if (typeof value === 'bigint') return value.toString() + 'n';
  if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`;
  if (value instanceof Error) return serializeError(value, redact, seen);
  if (typeof value !== 'object') return value;
  if (depth > MAX_DEPTH) return '[Truncated]';
  if (Array.isArray(value)) return serializeArray(value, redact, seen, depth);
  try {
    if (seen.has(value)) return '[Circular]';
    seen.add(value);
    const output = Object.create(null);
    const keys = Object.keys(value);
    for (const key of keys.slice(0, MAX_KEYS)) {
      try {
        if (redact.has(key.toLowerCase())) { output[key] = '[REDACTED]'; continue; }
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (!descriptor || !('value' in descriptor)) { output[key] = '[Unserializable]'; continue; }
        const child = descriptor.value;
        if (child === null) output[key] = null;
        else if (child instanceof Error) output[key] = safeSerialize(child, redact, seen, true, depth + 1);
        else if (Array.isArray(child)) output[key] = safeSerialize(child, redact, seen, true, depth + 1);
        else if (typeof child === 'object') output[key] = safeSerialize(child, redact, seen, true, depth + 1);
        else if (typeof child === 'bigint') output[key] = child.toString() + 'n';
        else if (typeof child === 'function') output[key] = `[Function: ${child.name || 'anonymous'}]`;
        else output[key] = child;
      } catch { output[key] = '[Unserializable]'; }
    }
    if (keys.length > MAX_KEYS) output.__truncated = '[Truncated]';
    return output;
  } catch { return '[Unserializable]'; }
  finally { seen.delete(value); }
};

export const safeSerialize = (value, redact = new Set(), seen, normalized = false, depth = 0) => {
  try {
    const traversal = seen ?? new WeakSet();
    const normalizedRedact = normalized ? redact : normalizeRedact(redact);
    return serializeValue(value, normalizedRedact, traversal, depth);
  } catch { return '[Unserializable]'; }
};

const normalizeRedact = (redact) => {
  const normalized = new Set();
  try {
    for (const key of redact) {
      try { normalized.add(String(key).toLowerCase()); } catch {}
    }
  } catch {}
  return normalized;
};
