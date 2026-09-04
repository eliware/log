import { safeSerialize } from '../serialization/safe-serialize.mjs';

export const textFormat = (redact) => ({ level, message, ...meta }) => {
  let output = `[${typeof level === 'string' ? level.toUpperCase() : 'INFO'}] ${message ?? ''}`;
  const keys = Object.keys(meta).filter(key => key !== 'level' && key !== 'message');
  if (keys.length > 0) {
    const safeMeta = {};
    for (const key of keys) safeMeta[key] = safeSerialize(meta[key], redact);
    try { output += ' ' + JSON.stringify(safeMeta); } catch { output += ' [Unserializable]'; }
  }
  return output;
};
