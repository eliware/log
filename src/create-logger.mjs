import winston from 'winston';
import { jsonFormat } from './formats/json.mjs';
import { textFormat } from './formats/text.mjs';
import { patchLoggerLevels } from './logger-levels.mjs';

export const createLogger = ({
  level = process.env.LOG_LEVEL || 'info',
  transports = [new winston.transports.Console()],
  format = 'text',
  timestamp = false,
  redactKeys = []
} = {}) => {
  if (format !== 'text' && format !== 'json') throw new TypeError('format must be text or json');
  const redact = new Set(redactKeys.map(key => String(key).toLowerCase()));
  const logger = winston.createLogger({
    level,
    format: format === 'json' ? jsonFormat(redact, timestamp) : winston.format.printf(textFormat(redact)),
    transports
  });
  return patchLoggerLevels(logger);
};
