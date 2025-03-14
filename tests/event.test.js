const Event = require('../models/Event');
const { events } = require('../data');

// Clear events array before each test
beforeEach(() => {
  events.length = 0;
});

describe('Event Model', () => {
  test('should create a new event', () => {
    const eventData = {
      name: 'Team Meeting',
      description: 'Weekly team sync-up',
      date: new Date('2023-04-15'),
      time: '10:00 AM',
      category: 'Meetings',
      userId: 1
    };

    const event = Event.create(eventData);
    
    expect(event.id).toBeDefined();
    expect(event.name).toBe('Team Meeting');
    expect(event.description).toBe('Weekly team sync-up');
    expect(events.length).toBe(1);
  });

  test('should find events by userId', () => {
    // Create test events
    Event.create({
      name: 'Team Meeting',
      description: 'Weekly team sync-up',
      date: new Date('2023-04-15'),
      time: '10:00 AM',
      category: 'Meetings',
      userId: 1
    });
    
    Event.create({
      name: 'Doctor Appointment',
      description: 'Annual checkup',
      date: new Date('2023-04-20'),
      time: '2:00 PM',
      category: 'Appointments',
      userId: 1
    });
    
    Event.create({
      name: 'Birthday Party',
      description: 'John\'s birthday',
      date: new Date('2023-04-25'),
      time: '7:00 PM',
      category: 'Birthdays',
      userId: 2
    });

    // Find events for userId 1
    const userEvents = Event.find({ userId: 1 });
    
    expect(userEvents.length).toBe(2);
    expect(userEvents[0].category).toBe('Meetings');
    expect(userEvents[1].category).toBe('Appointments');
  });

  test('should update an event', () => {
    // Create test event
    const event = Event.create({
      name: 'Team Meeting',
      description: 'Weekly team sync-up',
      date: new Date('2023-04-15'),
      time: '10:00 AM',
      category: 'Meetings',
      userId: 1
    });
    
    // Update event
    const updatedEvent = Event.findOneAndUpdate(
      { _id: event.id, userId: 1 },
      { name: 'Updated Meeting', description: 'Updated description' }
    );
    
    expect(updatedEvent.name).toBe('Updated Meeting');
    expect(updatedEvent.description).toBe('Updated description');
    // Time should remain unchanged
    expect(updatedEvent.time).toBe('10:00 AM');
  });

  test('should delete an event', () => {
    // Create test event
    const event = Event.create({
      name: 'Team Meeting',
      description: 'Weekly team sync-up',
      date: new Date('2023-04-15'),
      time: '10:00 AM',
      category: 'Meetings',
      userId: 1
    });
    
    // Delete event
    const deletedEvent = Event.findOneAndDelete({ _id: event.id, userId: 1 });
    
    expect(deletedEvent).toBeDefined();
    expect(deletedEvent.name).toBe('Team Meeting');
    expect(events.length).toBe(0);
  });
}); 