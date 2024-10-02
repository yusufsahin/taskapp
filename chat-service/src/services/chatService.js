const users = {}; // Keeps track of users in each task room

// Add user to the task room
const addUserToTaskRoom = (taskId, userId) => {
    if (!users[taskId]) {
        users[taskId] = [];
    }
    users[taskId].push(userId);
    return users[taskId];
};

// Remove user from task room
const removeUserFromTaskRoom = (taskId, userId) => {
    if (users[taskId]) {
        users[taskId] = users[taskId].filter((id) => id !== userId);
    }
    return users[taskId];
};

// Get list of users in a task room
const getUsersInTaskRoom = (taskId) => {
    return users[taskId] || [];
};

module.exports = {
    addUserToTaskRoom,
    removeUserFromTaskRoom,
    getUsersInTaskRoom,
};
