const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/tasks', authMiddleware, taskController.createTask);
router.put('/tasks/:id', authMiddleware, taskController.updateTask);
router.get('/tasks/:id', authMiddleware, taskController.getTaskById);
router.get('/tasks', authMiddleware, taskController.getAllTasks);
router.delete('/tasks/:id', authMiddleware, taskController.deleteTask);

module.exports = router;
