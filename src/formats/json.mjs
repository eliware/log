import winston from 'winston';
import { safeSerialize } from '@eliware/redact';

const messageSymbol = Symbol.for('message');
const sanitizedSymbol = Symbol('sanitized');

export const jsonFormat = (redact, timestamp) => {
  // Sanitize eagerly so every emitted record has deterministic, transport-independent metadata.
  const sanitize = winston.format((info) => {
    const { level, message, ...metadata } = info;
    const safeMessage = typeof message === 'string' ? message : safeSerialize(message, redact);
    const sanitized = { level, message: safeMessage, ...safeSerialize(metadata, redact) };
    info[sanitizedSymbol] = sanitized;
    return info;
  });
  const output = winston.format((info) => {
    try {
      const record = info[sanitizedSymbol];
      info[messageSymbol] = JSON.stringify(record);
    } catch {
      const fallback = { level: info.level ?? '[Unserializable]', message: safeSerialize(info.message, redact) };
      try { info[messageSymbol] = JSON.stringify(fallback); } catch { info[messageSymbol] = '{"level":"[Unserializable]","message":"[Unserializable]"}'; }
    }
    return info;
  });
  return winston.format.combine(...(timestamp ? [winston.format.timestamp()] : []), sanitize(), output());
};
