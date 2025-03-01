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
const db = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.mem1m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Connect to MongoDB
mongoose.connect(db, { dbName: 'app_db' });

//
app.use(express.urlencoded({ extended: false }));

// Whenever GET is called, check the query for both userID and username
app.get('/getUser/:query', async (req, res) => {
    const { query } = req.params;

    try {
        // Attempt to find a user with given ID or username in database
        const user = await User.findOne({ auth0_id: query }) || await User.findOne({ username: query });

        // Cast a truthy/falsy value to true/false (EX: 0 will become false [boolean type])
        const exists = !!user;

        // If a result exists, return its content; otherwise, return false
        (exists) ? res.json({ user }) : res.json({ exists });
    } catch (error) { // If an error occurs, return an error message in json format and output it to console
        res.status(500).json({ error: "Server error." });
        console.log(error);
    }
});

// 
app.get('/getGoals/:userID', async (req, res) => {
    const { userID } = req.params;

    try {
        // 
        const goalsDocument = await Goals.find({ ownerID: userID });

        // 
        const exists = !!goalsDocument;

        // 
        (exists) ? res.json({ goalsDocument }) : res.json({ exists });
    } catch (error) {
        res.status(500).json({ error: "Server error." });
        console.log(error);
    }
})

// 
app.post('/goal', async (req, res) => {
    const newGoalData = new Goal({
        goalName: req.body.goalName,
        goalDescription: req.body.goalDescription,
        ownerID: req.body.ownerID
    });

    try {
        // 
        await newGoalData.save();
        res.send("New goal has been created.")
    } catch (err) {  // Set result to POST error
        // 
        // Error code ____ represents unsuccesful POST
        // 


        // res.status(400).json({ error: "Goal POST Error." });
        console.log(err);
    }

});

// If port is specified in .env, use it; otherwise, default to 8000
const port = process.env.PORT || 8000;

// 
app.listen(port, () => {
    console.log(`Server running on port ${port}.`);

    User.insertOne({ email: 'test', auth0_id: 'test', created_at: Date(), last_login: Date(), username: 'test' });
});