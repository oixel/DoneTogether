const express = require('express');
const { clerkMiddleware, requireAuth } = require('@clerk/express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');

// Import .env file
dotenv.config();

// Create express app an ensure it utilizes JSON, CORS, and the Clerk middleware
const app = express();
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

const mongoClient = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectToMongo() {
  await mongoClient.connect();
  db = mongoClient.db(process.env.MONGODB_DB || 'myapp');
}

// GET user from MongoDB database
app.get('/api/user', requireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const user = await db.collection('users').findOne({ clerkId: userId });

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Update user data from Clerk to MongoDB
app.post('/api/user/sync', requireAuth(), async (req, res) => {
  // Store user's ID in a variable to make code cleaner
  const userId = req.auth.userId;

  // Create a user object from the passed in data
  const userData = {
    clerkId: userId,
    email: req.body.email,
    username: req.body.username,
    profileImageUrl: req.body.profileImageUrl,
    lastUpdated: new Date()
  };

  // Upsert user in database with the new user
  const result = await db.collection('users').updateOne(
    { clerkId: userId },
    {
      $set: userData,
      $setOnInsert: { createdAt: new Date() }
    },
    { upsert: true }
  );

  const user = await db.collection('users').findOne({ clerkId: userId });

  res.status(200).json({
    message: 'User synchronized successfully',
    isNewUser: result.upsertedCount > 0,
    user: user
  });
});

// 
app.get('getGoals/:userID', async (req, res) => {
  const { userId } = req.params;

  try {
    const goals = await db.collection('users').find({ clerkId: userId });
    return goals;
  } catch (error) {
    res.status(500).json({ error: "Server error while getting goals." });
    console.log(error);
  }
});

// 
app.post('/goal', async (req, res) => {
  try {
    const goal = {
      name: req.body.name,
      description: req.body.description,
      ownerId: req.body.ownerId
    };

    const result = await db.collection("goals").insertOne(goal);
    res.send(`Goal has been created with the ID ${result.insertedId}!`);
  } catch (error) {
    console.log(error);
  }
});

//
app.delete('/goal/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.deleteOne({ _id: new MongoClient.ObjectID(id) });

    // Send back success or failure message
    if (result.deletedCount === 1) {
      res.send("Successfully deleted goal.");
    }
    else {
      res.send("No goals were found with given ID. No documents deleted.")
    }
  } catch (error) {
    console.log(error);
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