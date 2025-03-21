# Event Planner and Reminder System

A Node.js application that serves as an event planning and reminder system. Users can create events, assign them to different categories, set reminder notifications, and view upcoming events based on various criteria.

## Features

- **Event Creation**: Create events with name, description, date, and time
- **Event Categorization**: Assign events to different categories (e.g., Meetings, Birthdays, Appointments)
- **Reminder System**: Set reminders for events and receive email notifications
- **View Events**: View upcoming events sorted by date, category, or reminder status
- **User Authentication**: Basic user authentication to manage events independently

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_gmail_account@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```
   Note: For EMAIL_PASS, you need to use an app password if you have 2FA enabled on your Google account.

4. Start the server:
   ```
   npm start
   ```
   For development with auto-reload:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- **POST** `/auth/register` - Register a new user
  - Body: `{ "username": "user1", "email": "user1@example.com", "password": "password123" }`

- **POST** `/auth/login` - Login and get authentication token
  - Body: `{ "email": "user1@example.com", "password": "password123" }`
  - Response: `{ "token": "jwt_token" }`

### Events

All event endpoints require Authorization header: `Authorization: Bearer jwt_token`

- **POST** `/events` - Create a new event
  - Body: 
    ```json
    {
      "name": "Team Meeting",
      "description": "Weekly team sync-up",
      "date": "2023-04-15",
      "time": "10:00 AM",
      "category": "Meetings",
      "reminderTime": "2023-04-15T09:45:00Z"
    }
    ```

- **GET** `/events` - Get all events for the authenticated user
  - Query parameters:
    - `sort=date` - Sort by date
    - `category=Meetings` - Filter by category
    - `reminder=true` - Filter events with reminders

- **PUT** `/events/:id` - Update an event
  - Body: Include fields to update

- **DELETE** `/events/:id` - Delete an event

## Testing

Run the test suite with:
```
npm test
``` #
