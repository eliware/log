import { patchLoggerLevels } from './logger-levels.mjs';
import { normalizeLoggerOptions } from './configuration/normalize-options.mjs';
import { buildLogger } from './configuration/build-logger.mjs';

export const createLogger = ({
  level = 'info',
  transports,
  format = 'text',
  timestamp = false,
  redactKeys = []
} = {}) => {
  const options = normalizeLoggerOptions({ level, transports, format, timestamp, redactKeys });
  return patchLoggerLevels(buildLogger(options));
};
