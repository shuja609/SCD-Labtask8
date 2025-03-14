const bcrypt = require('bcrypt');
const { users, generateUserId } = require('../data');

// Set default salt rounds
const SALT_ROUNDS = 10;

class User {
  constructor(userData) {
    this.id = generateUserId();
    this.username = userData.username;
    this.email = userData.email;
    this.password = userData.password;
  }

  static async create(userData) {
    try {
      // Check if username or email already exists
      if (users.some(user => user.username === userData.username)) {
        throw new Error('Username already exists');
      }
      if (users.some(user => user.email === userData.email)) {
        throw new Error('Email already exists');
      }

      // Hash the password - with error handling
      try {
        userData.password = await bcrypt.hash(userData.password, SALT_ROUNDS);
      } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Error processing password');
      }
      
      // Create and save the user
      const user = new User(userData);
      users.push(user);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static findOne(query) {
    return users.find(user => {
      for (const key in query) {
        if (user[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  }

  static findById(id) {
    return users.find(user => user.id === id);
  }

  async comparePassword(candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }
}

module.exports = User;
