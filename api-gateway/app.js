const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const proxy = require('express-http-proxy');
dotenv.config();

const app = express();

// Middleware for JWT authentication
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    try {
        const bearerToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
        req.user = decoded;  // Attach decoded token to request
        next();  // Proceed to next middleware/route
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// Proxy for auth-service (No authentication needed)
app.use('/api/auth', proxy('http://localhost:3000', {
    proxyReqPathResolver: function(req) {
        return '/auth' + req.url;  // Forward correctly to auth-service
    }
}));

// Proxy for user-service (Protected route)
app.use('/api/user', authMiddleware, proxy('http://localhost:3001', {
    proxyReqPathResolver: function(req) {
        return '/user' + req.url;
    }
}));

// Proxy for task-service (Protected route)
app.use('/api/task', authMiddleware, proxy('http://localhost:3002', {
    proxyReqPathResolver: function(req) {
        return '/task' + req.url;
    }
}));

// Proxy for chat-service (Protected route)
app.use('/api/chat', authMiddleware, proxy('http://localhost:3004', {
    proxyReqPathResolver: function(req) {
        return '/chat' + req.url;
    }
}));

// Start the API Gateway server
app.listen(3500, () => {
    console.log('API Gateway running on port 3500');
});
