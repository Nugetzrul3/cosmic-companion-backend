module.exports = {
    testEnvironment: 'node',
    testMatch: ["**/tests/**/*.test.js"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    clearMocks: true,
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['/node_modules/']
};