const amqp = require('amqplib/callback_api');
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
                    // Handle message content, e.g., chat notifications
                }, { noAck: true });
            });
        });
    });
};

module.exports = { initRabbitMQ };
