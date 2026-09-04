import winston from 'winston';
import { safeSerialize } from '../serialization/safe-serialize.mjs';

const messageSymbol = Symbol.for('message');
const sanitizedSymbol = Symbol('sanitized');

export const jsonFormat = (redact, timestamp) => {
  // Sanitize eagerly so every emitted record has deterministic, transport-independent metadata.
  const sanitize = winston.format((info) => {
    const sanitized = { ...info };
    for (const key of Object.keys(sanitized)) {
      if (key === 'level' || key === 'message') continue;
      sanitized[key] = redact.has(key.toLowerCase()) ? '[REDACTED]' : safeSerialize(sanitized[key], redact);
    }
    info[sanitizedSymbol] = sanitized;
    return info;
  });
  const output = winston.format((info) => {
    try {
      const record = info[sanitizedSymbol];
      if (info.timestamp !== undefined) record.timestamp = info.timestamp;
      info[messageSymbol] = JSON.stringify(record);
    } catch { info[messageSymbol] = '{"message":"[Unserializable]"}'; }
    return info;
  });
  return winston.format.combine(sanitize(), ...(timestamp ? [winston.format.timestamp()] : []), output());
};
