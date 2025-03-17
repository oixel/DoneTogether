const express = require('express');
const { clerkMiddleware, clerkClient } = require('@clerk/express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
// Import .env file
require('dotenv').config();

// Create express app an ensure it utilizes JSON, CORS, and the Clerk middleware
const app = express();
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

const mongoClient = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectToMongo() {
  await mongoClient.connect();
  db = mongoClient.db(process.env.MONGODB_DB || 'GoalData');
}

// Query for user from Clerk database by username
app.get('/userByName/:username', async (req, res) => {
  const { username } = req.params;
  try {
    // Query by username (will return array since some Clerk databases allow duplicate usernames)
    const { data } = await clerkClient.users.getUserList({ username: username });
    // Send successful status and return user information
    res.status(200).json({ user: data[0] });  // Return [0] since data is naturally an array, but only one user exists
  } catch (error) {
    res.status(500).send("Server error while getting user by username.");
  }
});

// Query for user from Clerk database by id
app.get('/userById/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Query by id (returns a single user since ids are always unique in Clerk)
    const user = await clerkClient.users.getUser(id);
    // Send successful status and return user information
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).send("Server error while getting user by ID");
  }
});

// Queries all goals where the user is a participant
// Updated to handle users as objects with userId property
app.get('/getGoals/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // Updated query to find goals where userId appears in the users array as an object
    const goals = await db.collection('goals').find({
      $or: [
        // Handle the new format (user objects with userId)
        { "users.userId": userId },
        // Handle the old format (array of user IDs as strings)
        { users: userId }
      ]
    }).toArray();

    // Return successful status and goals
    res.status(200).json({ goals: goals });
  } catch (error) {
    console.error("Error getting goals:", error);
    res.status(500).send("Server error while getting goals.");
  }
});

// Creates goal with the passed in request
app.post('/goal', async (req, res) => {
  try {
    const goal = {
      name: req.body.name,
      description: req.body.description,
      ownerId: req.body.ownerId,
      users: req.body.users
    };

    const result = await db.collection('goals').insertOne(goal);
    res.send(`Goal has been created with the ID ${result.insertedId}!`);
  } catch (error) {
    console.error("Error creating goal:", error);
    res.status(500).send("Server error while creating new goal.");
  }
});

// Updates goal's users - modified to handle user objects
app.put('/goal', async (req, res) => {
  try {
    // Define parameters of update request
    const filter = { _id: new ObjectId(req.body._id) };

    // Stores the update type / data
    let update;

    // If a new user is being added, push it to the end of the users array
    if (req.body.newUserObject) {
      update = { $push: { users: req.body.newUserObject } };
    }
    // If the users data is being updated, simply replace the users data with the updated version
    else if (req.body.users) {
      update = { $set: { users: req.body.users } };
    }
    // Otherwise, give an error
    else {
      return res.status(400).send("MISSING newUserObject/users in request.");
    }

    // Update goal with matching ID to match the new users array
    const result = await db.collection('goals').updateOne(filter, update, { upsert: true });

    // Return a message with how many documents were modified
    res.send(`${result.modifiedCount} document(s) have been updated.`); // Fixed from result.modified to result.modifiedCount
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).send("Server error while updating goal.");
  }
});

// Delete goal with given ObjectId in MongoDB
app.delete('/goal/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.collection('goals').deleteOne({ _id: new ObjectId(id) });
    // Send back success or failure message
    const message = (result.deletedCount === 1) ? "Successfully deleted goal." : "No goals were found with given ID. No goals were deleted.";
    res.send(message);
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).send(`Ran into error ${error}.`);
  }
});

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
    const existingRequest = await db.collection('goalRequests').findOne({
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

    const result = await db.collection('goalRequests').insertOne(request);
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
    const requests = await db.collection('goalRequests')
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
    await db.collection('goalRequests').updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status } }
    );

    // If accepted, add the user to the goal
    if (status === 'accepted') {
      const request = await db.collection('goalRequests').findOne({ _id: new ObjectId(requestId) });

      if (request) {
        const newUserObject = {
          userId: request.userId,
          joinedAt: new Date(),
          completed: false
        };

        await db.collection('goals').updateOne(
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



const PORT = process.env.PORT || 3001;

async function startServer() {
  await connectToMongo();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();