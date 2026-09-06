export const patchLoggerLevels = (logger) => {
  // Only Winston's configured level methods are part of the primitive-meta contract.
  const levels = new Set(Object.keys(logger.levels));
  for (const method of levels) {
    const original = logger[method];
    if (typeof original !== 'function') {
      throw new TypeError(`Configured logger level "${method}" is not callable`);
    }
  }
  return new Proxy(logger, {
    get(target, property, receiver) {
      const original = Reflect.get(target, property, receiver);
      if (property === 'child' && typeof original === 'function') {
        return (...args) => patchLoggerLevels(original.apply(target, args));
      }
      if (!levels.has(property) || typeof original !== 'function') return original;
      return function (message, meta) {
        const context = this == null || this === globalThis ? target : this;
        if (arguments.length >= 2 && meta !== undefined && (typeof meta !== 'object' || meta === null || Array.isArray(meta))) {
          return original.apply(context, [message, { value: meta }, ...Array.from(arguments).slice(2)]);
        }
        return original.apply(context, arguments);
      }
    }
  });
};
