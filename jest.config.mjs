// Jest configuration file
export default {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  globalTeardown: './tests/helpers/teardown.js' // Add global teardown
};
