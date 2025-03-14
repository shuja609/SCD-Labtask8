const { events, generateEventId } = require('../data');

class Event {
  constructor(eventData) {
    this.id = generateEventId();
    this.name = eventData.name;
    this.description = eventData.description;
    this.date = eventData.date;
    this.time = eventData.time;
    this.category = eventData.category;
    this.userId = eventData.userId;
    this.reminderTime = eventData.reminderTime || null;
  }

  static create(eventData) {
    const event = new Event(eventData);
    events.push(event);
    return event;
  }

  static find(query) {
    return events.filter(event => {
      for (const key in query) {
        if (key === 'reminderTime' && query[key]['$exists']) {
          // Special case for $exists operator
          if (query[key]['$exists'] && !event.reminderTime) return false;
          if (!query[key]['$exists'] && event.reminderTime) return false;
        } else if (key === 'reminderTime' && query[key]['$lte']) {
          // Special case for $lte operator
          const compareDate = new Date(query[key]['$lte']);
          const reminderDate = new Date(event.reminderTime);
          if (!(reminderDate <= compareDate)) return false;
        } else if (event[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  }

  static findById(id) {
    return events.find(event => event.id === id);
  }

  static findOneAndUpdate(query, updates, options) {
    const event = events.find(event => {
      for (const key in query) {
        if (key === '_id') {
          if (event.id !== parseInt(query[key])) return false;
        } else if (event[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });

    if (!event) return null;

    // Update event properties
    for (const key in updates) {
      event[key] = updates[key];
    }

    return event;
  }

  static findOneAndDelete(query) {
    const index = events.findIndex(event => {
      for (const key in query) {
        if (key === '_id') {
          if (event.id !== parseInt(query[key])) return false;
        } else if (event[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });

    if (index === -1) return null;

    // Remove and return the event
    const [removedEvent] = events.splice(index, 1);
    return removedEvent;
  }
}

module.exports = Event;
