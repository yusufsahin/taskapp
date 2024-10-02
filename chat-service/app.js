const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { initRabbitMQ } = require('./src/config/rabbitmq');
const chatService = require('./src/services/chatService');
const socketAuth = require('./src/middleware/auth');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

// Apply JWT authentication middleware to WebSocket connections
io.use(socketAuth);

// Listen for WebSocket connections
io.on('connection', (socket) => {
    console.log(`User ${socket.user.id} connected`);

    // Join a task chat room
    socket.on('joinTaskRoom', ({ taskId }) => {
        socket.join(taskId);
        chatService.addUserToTaskRoom(taskId, socket.user.id);
        console.log(`User ${socket.user.id} joined task room ${taskId}`);
        
        // Notify others in the room about the new user
        socket.to(taskId).emit('userJoined', { userId: socket.user.id });
    });

    // Handle receiving and broadcasting messages
    socket.on('sendMessage', ({ taskId, message }) => {
        const msg = { userId: socket.user.id, message, timestamp: new Date() };
        io.in(taskId).emit('receiveMessage', msg);
    });

    // Handle user disconnecting
    socket.on('disconnect', () => {
        console.log(`User ${socket.user.id} disconnected`);
    });
});

// Initialize RabbitMQ for chat service
initRabbitMQ('task_chat_queue');

server.listen(3004, () => {
    console.log('Chat service running on port 3004');
});
