// In-memory data storage

// Users array to store user objects
const users = [];

// Events array to store event objects
const events = [];

// ID generators - a simple counter for each collection
let nextUserId = 1;
let nextEventId = 1;

const generateUserId = () => {
  return nextUserId++;
};

const generateEventId = () => {
  return nextEventId++;
};

module.exports = {
  users,
  events,
  generateUserId,
  generateEventId
}; 