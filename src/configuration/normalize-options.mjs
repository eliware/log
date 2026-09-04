import winston from 'winston';
import { createDefaultTransports } from './default-options.mjs';

export const normalizeLoggerOptions = ({ level, transports, format, timestamp, redactKeys }) => {
  if (format !== 'text' && format !== 'json') throw new TypeError('format must be text or json');
  const configuredTransports = transports ?? createDefaultTransports();
  if (!Array.isArray(configuredTransports)) throw new TypeError('transports must be an array');
  if (redactKeys !== undefined && !Array.isArray(redactKeys)) throw new TypeError('redactKeys must be an array');
  if (!Object.hasOwn(winston.config.npm.levels, level)) throw new TypeError(`Unknown logger level "${level}"`);
  const validLevel = level;
  const redact = new Set((redactKeys ?? []).filter(key => typeof key === 'string').map(key => key.toLowerCase()));
  return { level: validLevel, transports: configuredTransports, format, timestamp, redact };
};
