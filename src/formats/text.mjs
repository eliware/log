import { safeSerialize } from '../serialization/safe-serialize.mjs';

export const textFormat = (redact) => ({ level, message, ...meta }) => {
  let output = `[${level.toUpperCase()}] ${message}`;
  const keys = Object.keys(meta).filter(key => key !== 'level' && key !== 'message');
  if (keys.length > 0) {
    const safeMeta = {};
    for (const key of keys) safeMeta[key] = safeSerialize(meta[key], redact);
    output += ' ' + JSON.stringify(safeMeta);
  }
  return output;
};
