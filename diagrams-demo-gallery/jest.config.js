const path = require('path');
const sharedConfig = require('../jest.config.js')(__dirname);
module.exports = {
	...sharedConfig,
	preset: 'jest-puppeteer',
	roots: [path.join(__dirname, 'tests-e2e')],
};
