// Import mongoose to handle the creation of schemas
const mongoose = require('mongoose');

// Define and export the user schema for Mongo DB
const userSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    username: { type: String, required: true },
    // profilePictureURL: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Define and export the goal schema for Mongo DB
const goalSchema = new mongoose.Schema({
    goalID: { type: String, required: true },
    goalName: { type: String, required: true },
    goalDescription: { type: String, required: true },
    ownerID: { type: String, required: true }
});

const Goal = mongoose.model('Goal', goalSchema);

// Export defined schemas
module.exports = { User, Goal }