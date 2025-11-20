module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/*.improved.js',
    'utils/logger.js',
    'utils/cache.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!**/client/**',
    '!jest.config.js'
  ],
  testMatch: [
    '**/__tests__/**/*.js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/client/',
    '/coverage/',
    '/dist/',
    '/utils/test\\.js$',
    '/test\\.js$'
  ],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 30,
      lines: 40,
      statements: 40
    }
  },
  verbose: true,
  testTimeout: 10000
};
