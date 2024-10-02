const express = require('express');
const mongoose = require('./src/config/database');
const taskRoutes = require('./src/routes/taskRoutes');
const { initRabbitMQ } = require('./src/config/rabbitmq');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/api', taskRoutes);

initRabbitMQ('task_created_queue');
initRabbitMQ('task_updated_queue');
initRabbitMQ('task_deleted_queue');

app.listen(3002, () => {
    console.log('Task service running on port 3002');
});
