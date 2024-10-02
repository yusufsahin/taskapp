const Task = require('../models/Task');
const { sendToQueue } = require('../config/rabbitmq');

// Utility function for handling async controller functions
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Create a new task
exports.createTask = asyncHandler(async (req, res) => {
    const task = new Task(req.body);
    await task.save();

    sendToQueue('task_created_queue', { taskId: task._id, status: task.status });
    res.status(201).json(task);
});

// Update an existing task
exports.updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    sendToQueue('task_updated_queue', { taskId: task._id, status: task.status, updatedAt: task.updatedAt });
    res.status(200).json(task);
});

// Get a task by ID
exports.getTaskById = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
});

// Get all tasks
exports.getAllTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find();
    res.status(200).json(tasks);
});

// Delete a task by ID
exports.deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    sendToQueue('task_deleted_queue', { taskId: task._id });
    res.status(200).json({ message: 'Task deleted successfully' });
});
