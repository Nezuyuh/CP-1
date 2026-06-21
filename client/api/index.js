import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const app = require('../../src/app');
export default app;
