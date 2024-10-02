const express = require('express');
const { getUsersInTaskRoom } = require('../services/chatService');
const router = express.Router();

// Get users in a specific task room
router.get('/task/:taskId/users', (req, res) => {
    const taskId = req.params.taskId;
    const users = getUsersInTaskRoom(taskId);
    res.json(users);
});

module.exports = router;
