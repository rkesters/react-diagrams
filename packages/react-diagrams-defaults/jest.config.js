const sharedConfig = require('../../jest.config.js')(__dirname);
module.exports = {
	...sharedConfig,
	testEnvironment: 'jsdom',
	collectCoverageFrom: [
		...sharedConfig.collectCoverageFrom,
		'!src/index.ts'
	],
};
