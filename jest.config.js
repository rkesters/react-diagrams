const path = require('path');
module.exports = (dir) => ({
	preset: 'ts-jest',
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	testMatch: ['**/*.test.{ts,tsx}'],
	coverageDirectory: '.coverage',
	coverageReporters: [ "json", "lcov"],
	roots: ['<rootDir>/src', '<rootDir>/tests'],
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}',
		'!**/node_modules/**',
	],
});
