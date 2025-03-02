// Import required modules
const express = require('express');
const { MongoClient } = require('mongodb');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
let db;

// Connect to MongoDB
async function connectToMongo() {
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    
    db = client.db(process.env.DB_NAME || 'clerkApp');
    console.log('Connected to MongoDB');
    
    // Create indexes if they don't exist
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('users').createIndex({ clerkId: 1 }, { unique: true });
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Auth middleware
const requireAuth = ClerkExpressRequireAuth({
  onError: (err, req, res) => {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Routes

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Clerk webhook handler
app.post('/api/webhook/clerk', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    // Handle user.created event
    if (type === 'user.created') {
      const userData = {
        clerkId: data.id,
        username: data.username || data.id,
        email: data.email_addresses?.[0]?.email_address || '',
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        profileImageUrl: data.image_url || '',
        createdAt: new Date()
      };
      
      // Insert into MongoDB
      await db.collection('users').insertOne(userData);
      console.log(`User ${userData.username} created in MongoDB`);
    }
    
    // Handle user.updated event
    if (type === 'user.updated') {
      const userData = data;
      
      await db.collection('users').updateOne(
        { clerkId: userData.id },
        { 
          $set: { 
            username: userData.username,
            firstName: userData.first_name,
            lastName: userData.last_name,
            profileImageUrl: userData.image_url,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log(`User ${userData.id} updated in MongoDB`);
    }
    
    // Handle user.deleted event
    if (type === 'user.deleted') {
      const userData = data;
      
      await db.collection('users').deleteOne({ clerkId: userData.id });
      
      console.log(`User ${userData.id} deleted from MongoDB`);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User profile route
app.get('/api/user/profile', requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    
    const user = await db.collection('users').findOne({ clerkId: userId });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/user/profile', requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;
    const { bio, location, website } = req.body;
    
    const result = await db.collection('users').updateOne(
      { clerkId: userId },
      { 
        $set: { 
          bio, 
          location, 
          website,
          updatedAt: new Date() 
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check username availability
app.get('/api/check-username', async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    const existingUser = await db.collection('users').findOne({ username });
    
    res.json({ 
      available: !existingUser,
      message: existingUser ? 'Username is already taken' : 'Username is available' 
    });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
async function startServer() {
  await connectToMongo();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();