require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).send({ error: 'Username, email, and password are required' });
        }
        
        // Create user
        const user = await User.create({ username, email, password });
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(400).send({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).send({ error: 'Email and password are required' });
        }
        
        // Find user
        const user = User.findOne({ email });
        if (!user) {
            return res.status(401).send({ error: 'Invalid email or password' });
        }
        
        // Compare password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).send({ error: 'Invalid email or password' });
        }
        
        // Generate JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'default_secret_for_testing');
        res.send({ token });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;
