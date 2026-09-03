export const patchLoggerLevels = (logger) => {
  // Only Winston's configured level methods are part of the primitive-meta contract.
  for (const method of Object.keys(logger.levels)) {
    const original = logger[method];
    if (typeof original !== 'function') {
      throw new TypeError(`Configured logger level "${method}" is not callable`);
    }
    logger[method] = function (message, meta) {
      if (arguments.length === 2 && (typeof meta !== 'object' || meta === null || Array.isArray(meta))) {
        return original.call(this, message, { value: meta });
      }
      return original.apply(this, arguments);
    };
  }
  return logger;
};
