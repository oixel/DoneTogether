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
    const filter = { _id: new ObjectId(req.body._id) }; // Fixed typo from *id to _id
    
    // Check if newUserObj is provided (new format) or newUserId (old format)
    let update;
    if (req.body.newUserObj) {
      // New format: add user object to users array
      update = { $push: { users: req.body.newUserObj } };
    } else if (req.body.newUserId) {
      // Old format: add user ID string to users array
      update = { $push: { users: req.body.newUserId } };
    } else {
      return res.status(400).send("Missing newUserObj or newUserId in request");
    }
    
    // Update goal with matching ID to match the new users array
    const result = await db.collection('goals').updateOne(filter, update);
    
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

const PORT = process.env.PORT || 3001;

async function startServer() {
  await connectToMongo();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();