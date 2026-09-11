import { patchLoggerLevels } from './logger-levels.mjs';
import { normalizeLoggerOptions } from './configuration/normalize-options.mjs';
import { buildLogger } from './configuration/build-logger.mjs';

export const createLogger = ({
  level = 'info',
  transports,
  format = 'text',
  timestamp = false,
  keys = []
} = {}) => {
  const options = normalizeLoggerOptions({ level, transports, format, timestamp, keys });
  return patchLoggerLevels(buildLogger(options));
};
