import winston from 'winston';

/**
 * Factory to create a Winston logger instance.
 * @param {Object} [options]
 * @param {string} [options.level] - Log level (default: process.env.LOG_LEVEL or 'info')
 * @param {Array} [options.transports] - Array of Winston transports (default: Console)
 * @returns {winston.Logger}
 */
export const createLogger = ({
  level = process.env.LOG_LEVEL || 'info',
  transports = [new winston.transports.Console()],
  format = 'text',
  timestamp = false,
  redactKeys = []
} = {}) => {
  // Safe serializer: shallowly summarize objects without invoking toJSON/getters
  const safeSerialize = (obj) => {
    try {
      if (obj === null) return null;
      if (obj instanceof Error) return { name: obj.name, message: obj.message, stack: obj.stack };
      if (typeof obj !== 'object') return obj;
      const out = {};
      for (const k of Object.keys(obj)) {
        try {
          if (redact.has(k.toLowerCase())) { out[k] = '[REDACTED]'; continue; }
          const v = obj[k];
          if (v === null) { out[k] = null; continue; }
          if (typeof v === 'object') {
            const info = { type: v && v.constructor && v.constructor.name ? v.constructor.name : 'Object' };
            try { if ('id' in v && (typeof v.id === 'string' || typeof v.id === 'number')) info.id = v.id; } catch {}
            try { if ('name' in v && typeof v.name === 'string') info.name = v.name; } catch {}
            out[k] = info;
          } else if (typeof v === 'function') {
            out[k] = `[Function: ${v.name || 'anonymous'}]`;
          } else {
            out[k] = v;
          }
        } catch {
          out[k] = '[Unserializable]';
        }
      }
      return out;
    } catch {
      try { return String(obj); } catch { return '[Unserializable]'; }
    }
  };

  const redact = new Set(redactKeys.map(key => String(key).toLowerCase()));
  const sanitize = winston.format((info) => {
    for (const key of Object.keys(info)) {
      if (key === 'level' || key === 'message') continue;
      info[key] = redact.has(key.toLowerCase()) ? '[REDACTED]' : safeSerialize(info[key]);
    }
    return info;
  });
  const logger = winston.createLogger({
    level,
    format: format === 'json'
      ? winston.format.combine(sanitize(), ...(timestamp ? [winston.format.timestamp()] : []), winston.format.json())
      : winston.format.printf(({ level, message, ...meta }) => {
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
        // Build a safe meta object to avoid invoking toJSON on library objects
        const safeMeta = {};
        for (const k of metaKeys) {
          try {
            safeMeta[k] = safeSerialize(meta[k]);
          } catch {
          safeMeta[k] = '[Unserializable]';
          }
        }
        try {
          msg += ' ' + JSON.stringify(safeMeta, replacer);
        } catch {
          try {
            msg += ' ' + String(safeMeta);
          } catch {
            msg += ' [Unserializable meta]';
          }
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
export default log;
export { log };
