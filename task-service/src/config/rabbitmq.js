const amqp = require('amqplib/callback_api');
require('dotenv').config();

let channel;

const initRabbitMQ = () => {
    return new Promise((resolve, reject) => {
        amqp.connect(process.env.RABBITMQ_URL, (error0, connection) => {
            if (error0) return reject(error0);

            connection.createChannel((error1, ch) => {
                if (error1) return reject(error1);

                channel = ch;
                console.log('RabbitMQ: Connected and ready to send messages');
                resolve(channel);
            });
        });
    });
};

const sendToQueue = (queue, message) => {
    if (!channel) throw new Error('RabbitMQ channel not initialized');
    channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Message sent to queue ${queue}:`, message);
};

module.exports = { initRabbitMQ, sendToQueue };
