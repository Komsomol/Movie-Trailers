module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'app.js',
    'getContent.js',
    'getData.js',
    'filterTrailers.js',
    'config/index.js',
    'constants/index.js',
    'services/youtubeApi.js',
    'routes/routes.js',
    'utils/logger.js',
    'utils/cache.js',
    'utils/errors.js',
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
      branches: 20,
      functions: 15,
      lines: 20,
      statements: 20
    }
  },
  verbose: true,
  testTimeout: 10000
};
