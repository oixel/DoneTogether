const express = require('express');
const { clerkMiddleware, clerkClient } = require('@clerk/express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

// Import .env file
require('dotenv').config();

// Import HTTP request functionality from external scripts
const { getUserByName, getUserById } = require('./api/userRequests.js');
const { createGoal, getGoals, updateGoal, deleteGoal } = require('./api/goalRequests.cjs');

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
  updateGoal(app, database);
  deleteGoal(app, database);
}



const GoalRequestSchema = {
  goalId: String,       // ID of the goal
  goalName: String,     // Name of the goal for display in notifications
  userId: String,       // ID of the user being invited
  inviterId: String,    // ID of the user who sent the invite
  status: String,       // 'pending', 'accepted', 'denied'
  createdAt: Date       // When the request was created
}

// API Endpoint for creating a goal request
app.post('/goalRequest', async (req, res) => {
  try {
    const { goalId, goalName, userId, inviterId } = req.body;

    console.log("Received body", { goalId, goalName, userId, inviterId });
    // Check if a request already exists
    const existingRequest = await database.collection('goalRequests').findOne({
      goalId,
      userId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).send("A request for this user to join this goal already exists.");
    }

    const request = {
      goalId,
      goalName,
      userId,
      inviterId,
      status: 'pending',
      createdAt: new Date()
    };

    const result = await database.collection('goalRequests').insertOne(request);
    res.status(201).json({ requestId: result.insertedId });
  } catch (error) {
    console.error("Error creating goal request:", error);
    res.status(500).send("Server error while creating goal request.");
  }
});

// API Endpoint for getting a user's pending requests
app.get('/goalRequests/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await database.collection('goalRequests')
      .find({ userId, status: 'pending' })
      .toArray();

    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching goal requests:", error);
    res.status(500).send("Server error while fetching goal requests.");
  }
});

// API Endpoint for responding to a request
app.put('/goalRequest/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // 'accepted' or 'denied'

    // Update the request status
    await database.collection('goalRequests').updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status } }
    );

    // If accepted, add the user to the goal
    if (status === 'accepted') {
      const request = await database.collection('goalRequests').findOne({ _id: new ObjectId(requestId) });

      if (request) {
        const newUserObject = {
          userId: request.userId,
          joinedAt: new Date(),
          completed: false
        };

        await database.collection('goals').updateOne(
          { _id: new ObjectId(request.goalId) },
          { $push: { users: newUserObject } }
        );
      }
    }

    res.status(200).send(`Request ${status}.`);
  } catch (error) {
    console.error("Error responding to goal request:", error);
    res.status(500).send("Server error while responding to goal request.");
  }
});



// If a port is specified in the .env file, use it; otherwise, default to port 3001
const PORT = process.env.PORT || 3001;

// Start up server and log success message
async function startServer() {
  // 
  await connectToMongo();

  // 
  connectRouters();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();