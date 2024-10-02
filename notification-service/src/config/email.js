const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure nodemailer to use MailHog or any other SMTP server
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'localhost',
    port: process.env.EMAIL_PORT || 1025,
    secure: false,  // No SSL for MailHog
    auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
    },
    tls: {
        rejectUnauthorized: false  // Accept all certificates
    }
});

// Function to send an email
const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: 'no-reply@example.com',  // Sender address
        to,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
};

module.exports = sendEmail;
