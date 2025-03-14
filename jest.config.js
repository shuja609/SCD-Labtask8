module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Timeout for tests - increase if needed
  testTimeout: 10000,

  // Environment for tests
  testEnvironment: "node",
  
  // Verbose output for diagnostics
  verbose: true,
  
  // Force exit after tests are complete
  forceExit: true,
  
  // Detect open handles (like database connections) that prevent Jest from exiting
  detectOpenHandles: true,
  
  // TestPathIgnorePatterns: modules to ignore during tests
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
  
  // Setup file to run before tests
  setupFilesAfterEnv: ['./jest.setup.js']
}; 