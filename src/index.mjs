import { createLogger } from './create-logger.mjs';
export { safeSerialize } from './serialization/safe-serialize.mjs';
export { createLogger };

const log = createLogger();
export default log;
export { log };
