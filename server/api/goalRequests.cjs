const { ObjectId } = require('mongodb');

// Creates goal with the passed in request
async function createGoal(app, database) {
    app.post('/goal', async (req, res) => {
        try {
            const goal = {
                name: req.body.name,
                description: req.body.description,
                ownerId: req.body.ownerId,
                users: req.body.users
            };

            const result = await database.collection('goals').insertOne(goal);
            res.send(`Goal has been created with the ID ${result.insertedId}!`);
        } catch (error) {
            console.error("Error creating goal:", error);
            res.status(500).send("Server error while creating new goal.");
        }
    });
};

// Queries all goals where the user is a participant
// Updated to handle users as objects with userId property
async function getGoals(app, database) {
    app.get('/getGoals/:userId', async (req, res) => {
        const { userId } = req.params;

        try {
            // Updated query to find goals where userId appears in the users array as an object
            const goals = await database.collection('goals').find({
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
};

// Updates goal's users
async function updateGoalUsers(app, database) {
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
            const result = await database.collection('goals').updateOne(filter, update, { upsert: true });

            // Return a message with how many documents were modified
            res.send(`${result.modifiedCount} document(s) have been updated.`); // Fixed from result.modified to result.modifiedCount
        } catch (error) {
            console.error("Error updating goal:", error);
            res.status(500).send("Server error while updating goal.");
        }
    });
};

// Send a patch request to update a specific user's goal completion
async function updateGoalCompletion(app, database) {
    app.patch('/goal', async (req, res) => {
        try {
            const filter = { _id: new ObjectId(req.body._id) };
            var update = { $set: { 'users.$[user].completed': req.body.completed } };
            const options = { arrayFilters: [{ 'user.userId': req.body.userId }] }

            const result = await database.collection('goals').updateOne(filter, update, options);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send(`Ran into error ${error} while updating goal completion.`);
        }
    });
}

// Delete goal with given ObjectId in MongoDB
async function deleteGoal(app, database) {
    app.delete('/goal/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const result = await database.collection('goals').deleteOne({ _id: new ObjectId(id) });

            // Send back success or failure message
            const message = (result.deletedCount === 1) ? "Successfully deleted goal." : "No goals were found with given ID. No goals were deleted.";
            res.send(message);
        } catch (error) {
            res.status(500).send(`Ran into error ${error} while deleting goal.`);
        }
    });
};

// Export all HTTP request router functions
module.exports = { createGoal, getGoals, updateGoalUsers, updateGoalCompletion, deleteGoal };