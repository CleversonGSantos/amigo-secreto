module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: ['js/**/*.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text-summary']
};