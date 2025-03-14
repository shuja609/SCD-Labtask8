require('dotenv').config();
const express = require('express');
const Event = require('../models/Event');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.use((req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).send({ error: 'Authorization header missing' });
        
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401).send({ error: 'Unauthorized' });
            req.userId = decoded.userId;
            next();
        });
    } catch (error) {
        res.status(401).send({ error: 'Authentication failed' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, description, date, time, category, reminderTime } = req.body;
        // Using the static create method instead of the mongoose model
        const event = Event.create({ name, description, date, time, category, userId: req.userId, reminderTime });
        res.status(201).send(event);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const { sort, category, reminder } = req.query;
        let query = { userId: req.userId };
        if (category) query.category = category;
        if (reminder === 'true') query.reminderTime = { $exists: true };

        let events = Event.find(query);
        
        // Sort events if requested
        if (sort === 'date') {
            events = events.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        res.send(events);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const event = Event.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );
        
        if (!event) return res.status(404).send({ error: 'Event not found' });
        res.send(event);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const event = Event.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!event) return res.status(404).send({ error: 'Event not found' });
        res.send({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;
