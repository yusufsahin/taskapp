const amqp = require('amqplib/callback_api');
require('dotenv').config();

let channel;

const initRabbitMQ = (queueName) => {
    amqp.connect(process.env.RABBITMQ_URL, (error0, connection) => {
        if (error0) throw error0;

        connection.createChannel((error1, ch) => {
            if (error1) throw error1;

            channel = ch;
            channel.assertQueue(queueName, { durable: false });
            console.log(`RabbitMQ: Waiting for messages in ${queueName}`);
        });
    });
};

const sendToQueue = (queue, message) => {
    if (!channel) throw new Error('RabbitMQ channel not initialized');
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
};

module.exports = { initRabbitMQ, sendToQueue };
