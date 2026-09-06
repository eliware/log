import winston from 'winston';
import { redactValue, safeSerialize } from '@eliware/redact';

const messageSymbol = Symbol.for('message');
const sanitizedSymbol = Symbol('sanitized');

export const jsonFormat = (redact, timestamp) => {
  // Sanitize eagerly so every emitted record has deterministic, transport-independent metadata.
  const sanitize = winston.format((info) => {
    const { level, message, ...metadata } = info;
    const sanitized = { level, message, ...safeSerialize(redactValue(metadata, redact), redact) };
    sanitized.level = info.level;
    sanitized.message = info.message;
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
