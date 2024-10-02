const amqp = require('amqplib/callback_api');
const { createUserProfile } = require('../controllers/userController'); // Import the function
require('dotenv').config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;

const initRabbitMQ = () => {
    amqp.connect(RABBITMQ_URL, (error0, connection) => {
        if (error0) throw error0;

        connection.createChannel((error1, channel) => {
            if (error1) throw error1;
            const queue = 'user_creation_queue';

            channel.assertQueue(queue, { durable: false });
            console.log(`Listening for messages in ${queue}`);

            channel.consume(queue, async (msg) => {
                const userData = JSON.parse(msg.content.toString());
                try {
                    // Call the createUserProfile function to handle the message
                    await createUserProfile(userData);
                    console.log('User profile created successfully');
                } catch (error) {
                    console.error('Error creating user profile:', error);
                }
            }, { noAck: true });
        });
    });
};

module.exports = { initRabbitMQ };

