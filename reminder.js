require('dotenv').config();
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Event = require('./models/Event');
const User = require('./models/User');

// Check if email credentials are available
const hasEmailCredentials = process.env.EMAIL_USER && process.env.EMAIL_PASS;

// Create email transporter if credentials are available
let transporter = null;
if (hasEmailCredentials) {
    try {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        
        // Verify transporter
        transporter.verify(function(error, success) {
            if (error) {
                console.log('Email transporter error:', error);
                transporter = null;
            } else {
                console.log('Email server is ready to send messages');
            }
        });
    } catch (error) {
        console.log('Error setting up email transporter:', error);
    }
} else {
    console.log('Email credentials not provided. Email notifications will be logged to console only.');
}

// Helper function to send or log reminder
function sendReminder(user, event) {
    const reminderText = `Reminder for your event: ${event.name} at ${event.time}`;
    
    // If transporter is available, send email
    if (transporter) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Event Reminder',
            text: reminderText
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                // Log to console as fallback
                console.log(`REMINDER for ${user.email}: ${reminderText}`);
            } else {
                console.log('Email sent: ' + info.response);
            }
            
            // After handling the reminder, remove the reminderTime
            event.reminderTime = null;
        });
    } else {
        // Log to console as fallback
        console.log(`REMINDER for ${user.email}: ${reminderText}`);
        
        // After handling the reminder, remove the reminderTime
        event.reminderTime = null;
    }
}

// Schedule the cron job
cron.schedule('* * * * *', async () => {
    const now = new Date();
    const events = Event.find({ reminderTime: { $lte: now } });
    
    if (events.length > 0) {
        console.log(`Processing ${events.length} reminder(s) at ${now.toISOString()}`);
        
        events.forEach(event => {
            const user = User.findById(event.userId);
            
            if (user) {
                sendReminder(user, event);
            } else {
                console.log(`User not found for event ID: ${event.id}`);
                event.reminderTime = null; // Clean up reminderTime anyway
            }
        });
    }
});
