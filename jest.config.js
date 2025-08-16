module.exports = {
    testEnvironment: 'node',
    testMatch: ["**/tests/**/*.test.js"],
    clearMocks: true,
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['/node_modules/']
};