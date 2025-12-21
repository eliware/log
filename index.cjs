const winston = require('winston');

/**
 * Factory to create a Winston logger instance.
 * @param {Object} [options]
 * @param {string} [options.level] - Log level (default: process.env.LOG_LEVEL or 'info')
 * @param {Array} [options.transports] - Array of Winston transports (default: Console)
 * @returns {winston.Logger}
 */
const createLogger = ({
  level = process.env.LOG_LEVEL || 'info',
  transports = [new winston.transports.Console()]
} = {}) => {
  // Safe serializer: shallowly summarize objects without invoking toJSON/getters
  const safeSerialize = (obj) => {
    try {
      if (obj === null) return null;
      if (typeof obj !== 'object') return obj;
      const out = {};
      for (const k of Object.keys(obj)) {
        try {
          const v = obj[k];
          if (v === null) { out[k] = null; continue; }
          if (typeof v === 'object') {
            const info = { type: v && v.constructor && v.constructor.name ? v.constructor.name : 'Object' };
            try { if ('id' in v && (typeof v.id === 'string' || typeof v.id === 'number')) info.id = v.id; } catch (e) {}
            try { if ('name' in v && typeof v.name === 'string') info.name = v.name; } catch (e) {}
            out[k] = info;
          } else if (typeof v === 'function') {
            out[k] = `[Function: ${v.name || 'anonymous'}]`;
          } else {
            out[k] = v;
          }
        } catch (e) {
          out[k] = '[Unserializable]';
        }
      }
      return out;
    } catch (e) {
      try { return String(obj); } catch (ee) { return '[Unserializable]'; }
    }
  };

  const logger = winston.createLogger({
    level,
    format: winston.format.printf(({ level, message, ...meta }) => {
      let msg = `[${level.toUpperCase()}] ${message}`;
      const metaKeys = Object.keys(meta).filter(k => k !== 'level' && k !== 'message');
      if (metaKeys.length > 0) {
        // Custom replacer to handle BigInt and circular references
        const seen = new WeakSet();
        const replacer = (key, value) => {
          if (typeof value === 'bigint') return value.toString() + 'n';
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) return '[Circular]';
            seen.add(value);
          }
          return value;
        };
        const safeMeta = {};
        for (const k of metaKeys) {
          try { safeMeta[k] = safeSerialize(meta[k]); } catch (e) { safeMeta[k] = '[Unserializable]'; }
        }
        try {
          msg += ' ' + JSON.stringify(safeMeta, replacer);
        } catch (e) {
          try { msg += ' ' + String(safeMeta); } catch (ee) { msg += ' [Unserializable meta]'; }
        }
      }
      return msg;
    }),
    transports
  });

  // Patch logger methods to support primitive/array as meta
  const levels = Object.keys(logger.levels || winston.config.npm.levels);
  levels.forEach((method) => {
    const orig = logger[method];
    logger[method] = function (msg, meta) {
      if (arguments.length === 2 && (typeof meta !== 'object' || meta === null || Array.isArray(meta))) {
        return orig.call(this, msg, { value: meta });
      }
      return orig.apply(this, arguments);
    };
  });
  return logger;
};

const log = createLogger();
module.exports = log;
module.exports.createLogger = createLogger;
