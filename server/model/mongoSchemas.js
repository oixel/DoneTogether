// Import mongoose to handle the creation of schemas
const mongoose = require('mongoose');

// Define and export the user schema for Mongo DB
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    auth0_id: { type: String, required: true },
    created_at: { type: Date, required: true },
    last_login: { type: Date, required: true },
    username: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Define and export the goal schema for Mongo DB
const goalSchema = new mongoose.Schema({
    goalName: { type: String, required: true },
    goalDescription: { type: String, required: true },
    ownerID: { type: String, required: true }
});

const Goal = mongoose.model('Goal', goalSchema);

// Export defined schemas
module.exports = { User, Goal }