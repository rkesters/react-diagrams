const path = require('path');
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	roots: [path.join(__dirname, 'tests')],
	testMatch: ['**/*.test.{ts,tsx}'],
	coverageDirectory: '.coverage',
};
