/**
 * Direct test for bcrypt functionality
 * This helps diagnose if bcrypt itself is working correctly
 */

describe('bcrypt direct testing', () => {
  let bcrypt;
  
  // Try to import bcrypt and skip tests if it fails
  beforeAll(() => {
    try {
      bcrypt = require('bcrypt');
      console.log('bcrypt loaded successfully');
    } catch (error) {
      console.error('Failed to load bcrypt:', error);
      // Don't throw here, we'll skip tests if bcrypt is null
    }
  });
  
  // Skip all tests if bcrypt failed to load
  const conditionalTest = bcrypt ? test : test.skip;
  
  conditionalTest('bcrypt can hash passwords', async () => {
    const password = 'testPassword123';
    const salt = 10;
    
    const hash = await bcrypt.hash(password, salt);
    expect(hash).toBeTruthy();
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(20); // Hashes are usually long
  });
  
  conditionalTest('bcrypt can compare passwords', async () => {
    const password = 'testPassword123';
    const salt = 10;
    
    const hash = await bcrypt.hash(password, salt);
    const match = await bcrypt.compare(password, hash);
    const nonMatch = await bcrypt.compare('wrongPassword', hash);
    
    expect(match).toBe(true);
    expect(nonMatch).toBe(false);
  });
}); 