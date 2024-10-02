const amqp = require('amqplib/callback_api');
const sendEmail = require('./email');  // Make sure you have your nodemailer logic here
require('dotenv').config();

let channel;

const initRabbitMQ = (queueName) => {
    return new Promise((resolve, reject) => {
        amqp.connect(process.env.RABBITMQ_URL, (error0, connection) => {
            if (error0) return reject(error0);

            connection.createChannel((error1, ch) => {
                if (error1) return reject(error1);

                channel = ch;
                console.log(`RabbitMQ: Listening for messages in ${queueName}`);
                channel.assertQueue(queueName, { durable: false });

                channel.consume(queueName, async (msg) => {
                    const messageContent = JSON.parse(msg.content.toString());
                    console.log(`Received message: ${messageContent}`);
                    
                    // Call notification logic based on the message content
                    await sendNotification(messageContent);
                }, { noAck: true });
            });
        });
    });
};

// Notification logic that sends an email
const sendNotification = async (message) => {
    try {
        const { email, subject, content } = message;
        await sendEmail(email, subject, content);
        console.log(`Notification sent to ${email}`);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

module.exports = { initRabbitMQ };
