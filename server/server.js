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

// 
app.get('/userByName/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const { data } = await clerkClient.users.getUserList({ username: username });

    res.status(200).json({ user: data[0] });
  } catch (error) {
    res.status(500).send("Server error while getting user by username.");
  }
});

// 
app.get('/userById/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await clerkClient.users.getUser(id);
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).send("Server error while getting user by ID");
  }
});

// Queries all goals owned by the current user
app.get('/getGoals/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const goals = await db.collection('goals').find({ users: userId }).toArray();

    // Return successful status and goals
    res.status(200).json({ goals: goals });
  } catch (error) {
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
    res.status(500).send("Server error while creating new goal.");
  }
});

// Updates goal with new attributes (primarily used for adding new users to goals)
app.put('/goal', async (req, res) => {
  try {
    // 
    const filter = { _id: new ObjectId(req.body._id) };
    const update = { $push: { users: req.body.newUserId } };

    // 
    const result = await db.collection('goals').updateOne(filter, update, { upsert: true });

    // 
    res.send(`${result.modified} document(s) have been updated.`);
  } catch (error) {
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
    res.status(500).send(`Ran into error ${error}.`);
  }
})

const PORT = process.env.PORT || 3001;

async function startServer() {
  await connectToMongo();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();