require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');
const reminder = require('./reminder');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
