import winston from 'winston';
import { safeSerialize } from '../serialization/safe-serialize.mjs';

export const jsonFormat = (redact, timestamp) => {
  const sanitize = winston.format((info) => {
    for (const key of Object.keys(info)) {
      if (key === 'level' || key === 'message') continue;
      info[key] = redact.has(key.toLowerCase()) ? '[REDACTED]' : safeSerialize(info[key], redact);
    }
    return info;
  });
  return winston.format.combine(sanitize(), ...(timestamp ? [winston.format.timestamp()] : []), winston.format.json());
};
