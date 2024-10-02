const jwt = require('jsonwebtoken');
require('dotenv').config();

// JWT middleware for Socket.IO
const socketAuth = (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;  // Attach the decoded user to the socket
        next();  // Allow the connection to proceed
    } catch (error) {
        next(new Error('Invalid token'));
    }
};

module.exports = socketAuth;
