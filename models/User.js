const bcrypt = require('bcrypt');
const { users, generateUserId } = require('../data');

class User {
  constructor(userData) {
    this.id = generateUserId();
    this.username = userData.username;
    this.email = userData.email;
    this.password = userData.password;
  }

  static async create(userData) {
    // Check if username or email already exists
    if (users.some(user => user.username === userData.username)) {
      throw new Error('Username already exists');
    }
    if (users.some(user => user.email === userData.email)) {
      throw new Error('Email already exists');
    }

    // Hash the password
    userData.password = await bcrypt.hash(userData.password, 10);
    
    // Create and save the user
    const user = new User(userData);
    users.push(user);
    return user;
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
    return bcrypt.compare(candidatePassword, this.password);
  }
}

module.exports = User;
