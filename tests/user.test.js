const User = require('../models/User');
const { users } = require('../data');
const bcrypt = require('bcrypt');

// Mock bcrypt to avoid actual hashing in tests
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Clear users array before each test
beforeEach(() => {
  users.length = 0;
  // Clear mock calls
  bcrypt.hash.mockClear();
  bcrypt.compare.mockClear();
});

describe('User Model', () => {
  test('should create a new user', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = await User.create(userData);
    
    expect(user.id).toBeDefined();
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
    expect(users.length).toBe(1);
    
    // Check if bcrypt.hash was called
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
  });

  test('should find a user by email', async () => {
    // Create a test user
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    
    const user = User.findOne({ email: 'test@example.com' });
    
    expect(user).toBeDefined();
    expect(user.username).toBe('testuser');
  });

  test('should compare passwords correctly', async () => {
    // Create a test user
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    
    const isMatch = await user.comparePassword('password123');
    
    expect(isMatch).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalled();
  });

  test('should not create user with duplicate username', async () => {
    // Create a test user
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    
    // Try to create another user with the same username
    await expect(User.create({
      username: 'testuser',
      email: 'another@example.com',
      password: 'password456'
    })).rejects.toThrow('Username already exists');
  });

  test('should not create user with duplicate email', async () => {
    // Create a test user
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    
    // Try to create another user with the same email
    await expect(User.create({
      username: 'anotheruser',
      email: 'test@example.com',
      password: 'password456'
    })).rejects.toThrow('Email already exists');
  });
}); 