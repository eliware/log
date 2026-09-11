import winston from 'winston';
import { createDefaultTransports } from './default-options.mjs';

export const normalizeLoggerOptions = ({ level, transports, format, timestamp, keys }) => {
  if (format !== 'text' && format !== 'json') throw new TypeError('format must be text or json');
  const configuredTransports = transports ?? createDefaultTransports();
  if (!Array.isArray(configuredTransports)) throw new TypeError('transports must be an array');
  if (keys !== undefined && !Array.isArray(keys)) throw new TypeError('keys must be an array');
  if (keys?.some(key => typeof key !== 'string')) throw new TypeError('keys must contain only strings');
  if (!Object.hasOwn(winston.config.npm.levels, level)) throw new TypeError(`Unknown logger level "${level}"`);
  const validLevel = level;
  return { level: validLevel, transports: configuredTransports, format, timestamp, redact: { keys: keys ?? [] } };
};
