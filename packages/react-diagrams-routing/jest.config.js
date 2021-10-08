const sharedConfig = require('../../jest.config.js')(__dirname);
module.exports = {
	...sharedConfig,
	collectCoverageFrom: [
		...sharedConfig.collectCoverageFrom,
		'!src/index.ts'
	],
};
