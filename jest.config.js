const path = require('path');
module.exports = (dir) => ({
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	roots: [path.join(dir, 'tests')],
	testMatch: ['**/*.test.{ts,tsx}'],
	coverageDirectory: '.coverage'
});
