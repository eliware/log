import { createLogger } from './src/create-logger.mjs';
export { safeSerialize } from './src/serialization/safe-serialize.mjs';
export { createLogger };

const log = createLogger();
export default log;
export { log };
