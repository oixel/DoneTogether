const express = require('express');
const { clerkMiddleware, requireAuth } = require('@clerk/express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
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

app.get('/api/user', requireAuth(), async (req, res) => {
  const clerkUserId = req.auth.userId;
  const user = await db.collection('users').findOne({ clerkId: clerkUserId });
 
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.post('/api/user/sync', requireAuth(), async (req, res) => {
  const clerkUserId = req.auth.userId;
 
  const userData = {
    clerkId: clerkUserId,
    email: req.body.email,
    username: req.body.username,
    profileImageUrl: req.body.profileImageUrl,
    lastUpdated: new Date()
  };
 
  const result = await db.collection('users').updateOne(
    { clerkId: clerkUserId },
    {
      $set: userData,
      $setOnInsert: { createdAt: new Date() }
    },
    { upsert: true }
  );
 
  const user = await db.collection('users').findOne({ clerkId: clerkUserId });
 
  res.status(200).json({
    message: 'User synchronized successfully',
    isNewUser: result.upsertedCount > 0,
    user: user
  });
});

const PORT = process.env.PORT || 3001;

async function startServer() {
  await connectToMongo();
 
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();