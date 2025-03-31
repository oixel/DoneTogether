const express = require('express');
const { clerkMiddleware, clerkClient } = require('@clerk/express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

// Import .env file
require('dotenv').config();

// Import HTTP request functionality from external scripts
const { getUserByName, getUserById } = require('./api/userRequests.js');
const { createGoal, getGoals, updateUsersList, updateGoalCompletion, deleteGoal, updateUserInGoal } = require('./api/goalRequests.cjs');

// Create express app an ensure it utilizes JSON, CORS, and the Clerk middleware
const app = express();
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// Create a new instance of mongo client
const mongoClient = new MongoClient(process.env.MONGODB_URI);

// Initialize database as a global variable
let database;

// Connect to the MongoDB database named in the .env file or default to "GoalData"
async function connectToMongo() {
  await mongoClient.connect();
  database = mongoClient.db(process.env.MONGODB_DB_NAME || 'GoalData');
}

// Connect to all the different express routers for the different HTTP requests
function connectRouters() {
  // Handles HTTP requests for user information from the Clerk database
  getUserByName(app, clerkClient);
  getUserById(app, clerkClient);

  // Handle HTTP requests for goals in MongoDB database
  createGoal(app, database);
  getGoals(app, database);
  updateUsersList(app, database);
  updateUserInGoal(app, database);
  deleteGoal(app, database);
}

// If a port is specified in the .env file, use it; otherwise, default to port 3001
const PORT = process.env.PORT || 3001;

// Start up server and log success message
async function startServer() {
  // Connect to MongoDB database on start up
  await connectToMongo();

  // Connect to all the HTTP routers from the external API scripts (userRequests.cjs and goalRequests.cjs)
  connectRouters();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();