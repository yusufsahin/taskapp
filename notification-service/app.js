const express = require('express');
const { initRabbitMQ } = require('./src/config/rabbitmq');
require('dotenv').config();

const app = express();

// Initialize RabbitMQ for notification service
initRabbitMQ('notification_queue');

// Start the server
app.listen(3003, () => {
    console.log('Notification service running on port 3003');
});
