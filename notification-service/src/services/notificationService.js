const sendEmail = require('../config/email');

// Function to send notifications based on the message
const sendNotification = async (message) => {
    try {
        const { email, subject, content } = message;
        await sendEmail(email, subject, content);
        console.log(`Notification sent to ${email}`);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

module.exports = { sendNotification };
