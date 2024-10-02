const UserProfile = require('../models/UserProfile');
const redisClient = require('../config/redis');

// TTL for cache in seconds (1 hour)
const CACHE_EXPIRATION = 3600;

// Function to create a new user profile
exports.createUserProfile = async (userData) => {
    const { email, firstname, lastname } = userData;

    // Check if the user profile already exists in MongoDB
    let userProfile = await UserProfile.findOne({ email });
    if (!userProfile) {
        // Create and save the profile in MongoDB
        userProfile = new UserProfile({ email, firstname, lastname });
        await userProfile.save();

        console.log('User profile created and saved in MongoDB');
    } else {
        console.log('User profile already exists in MongoDB');
    }

    // Cache the user profile in Redis
    await redisClient.setEx(email, CACHE_EXPIRATION, JSON.stringify(userProfile));
    console.log('User profile cached in Redis');

    return userProfile;
};

// Function to get a user profile, first checking Redis cache
exports.getUserProfile = async (email) => {
    // Check if the profile exists in Redis cache
    const cachedProfile = await redisClient.get(email);
    if (cachedProfile) {
        console.log('Cache hit: User profile retrieved from Redis');
        return JSON.parse(cachedProfile);
    }

    // If not cached, fetch the user profile from MongoDB
    const userProfile = await UserProfile.findOne({ email });
    if (userProfile) {
        // Cache the result in Redis for future requests
        await redisClient.setEx(email, CACHE_EXPIRATION, JSON.stringify(userProfile));
        console.log('User profile retrieved from MongoDB and cached in Redis');
    }

    return userProfile;
};
