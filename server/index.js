const cors = require('cors');

const mongoose = require('mongoose');
const { User, Goal } = require('./model/mongoSchemas.js');

const express = require('express');

// Import .env
require('dotenv').config()

// Create an express application and define its uses
const app = express();
app.use(express.json());
app.use(cors());

// Configure database
mongoose.set('strictQuery', true);
const db = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@testcluster.mimnp.mongodb.net/?retryWrites=true&w=majority&appName=TestCluster`;

// Connect to MongoDB
mongoose.connect(db, { dbName: 'DoneTogether' });

//
app.use(express.urlencoded({ extended: false }));
app.get('/checkUser/:query', async (req, res) => {
    const { query } = req.params;

    try {
        // Attempt to find a user with given username or ID in database
        const document = await User.findOne({ userID: query }) || await User.findOne({ username: query });

        // Cast a truthy/falsy value to true/false (EX: 0 will become false [boolean type])
        const exists = !!document;

        // If a result exists, return its content; otherwise, return false
        (exists) ? res.json({ document }) : res.json({ exists });
    } catch (error) { // If an error occurs, return an error message in json format and output it to console
        console.log(error);
        res.status(500).json({ error: "Server error." });
    }
});

app.post('/createUser', async (req, res) => {
    const newUserData = new User({
        userID: req.body.userID,
        username: req.body.username
    });

    try {
        await newUserData.save();
        res.send("New user has been created.");
    } catch (err) {
        console.log(err);
    }
});

// If port is specified in .env, use it; otherwise, default to 8000
const port = process.env.PORT || 8000;

// 
app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});