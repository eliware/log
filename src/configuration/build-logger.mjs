import winston from 'winston';
import { jsonFormat } from '../formats/json.mjs';
import { textFormat } from '../formats/text.mjs';

export const buildLogger = ({ level, transports, format, timestamp, redact }) => winston.createLogger({
  level,
  format: format === 'json' ? jsonFormat(redact, timestamp) : winston.format.printf(textFormat(redact)),
  transports
});
