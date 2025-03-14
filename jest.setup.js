/**
 * Global Jest setup to verify dependencies before running tests
 */

beforeAll(() => {
  console.log('Running global setup...');
  
  // Check if bcrypt is installed and can be required
  try {
    const bcrypt = require('bcrypt');
    console.log('bcrypt is properly installed, version:', bcrypt.version || 'unknown');
  } catch (error) {
    console.error('⚠️ Error loading bcrypt:', error.message);
    console.error('This might cause tests to fail if they depend on bcrypt.');
  }
  
  // Print Node.js version
  console.log('Node.js version:', process.version);
  console.log('Platform:', process.platform);
  
  // Check other critical dependencies
  const dependencies = ['express', 'jsonwebtoken', 'dotenv'];
  dependencies.forEach(dep => {
    try {
      require(dep);
      console.log(`✅ ${dep} loaded successfully`);
    } catch (error) {
      console.error(`⚠️ Error loading ${dep}:`, error.message);
    }
  });
}); 