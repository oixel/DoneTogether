const { ObjectId } = require('mongodb');

// Creates goal with the passed in request
async function createGoal(app, database) {
    app.post('/goal', async (req, res) => {
        try {
            const goal = {
                name: req.body.name,
                description: req.body.description,
                ownerId: req.body.ownerId,
                startDate: new Date(req.body.startDate),
                endDate: new Date(req.body.endDate),
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

// Update goal's basic information with new data
async function updateGoal(app, database) {
    app.patch('/goal', async (req, res) => {
        try {
            // Filter by the goal's unique id
            const filter = { _id: new ObjectId(req.body._id) };

            // Define attributes of update request
            const newInfo = {
                "$set": {
                    name: req.body.name,
                    description: req.body.description,
                    startDate: new Date(req.body.startDate),
                    endDate: new Date(req.body.endDate)
                }
            };

            // Update goal with matching ID to reflect changed information
            const result = await database.collection('goals').updateOne(filter, newInfo);


            // Return a success message with the updated result back
            res.status(200).send(result);
        } catch (error) {
            console.error("Error updating goal:", error);
            res.status(500).send("Server error while updating a goal.");
        }
    });
};

// Queries all goals where the user is a participant
// Updated to handle users as objects with userId property
function getGoals(app, database) {
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
function updateUsersList(app, database) {
    app.patch('/updateUsersList/:type', async (req, res) => {
        try {
            // Define parameters of update request
            const filter = { _id: new ObjectId(req.body._id) };

            // Stores the update type / data
            let update;

            // If a new user is being added, push it to the end of the users array
            if (req.params.type === 'add') {
                update = { $push: { users: req.body.userObject } };
            } else {  // Otherwise (when removing), remove the user from the array of users by their userId
                update = { $pull: { users: { userId: req.body.userObject.userId } } }
            }

            // Update goal with matching ID to match the new users array
            const result = await database.collection('goals').updateOne(filter, update, { upsert: true });

            // Return a success message with result back
            res.status(200).send(result);
        } catch (error) {
            console.error("Error updating goal:", error);
            res.status(500).send("Server error while updating goal.");
        }
    });
};

// Send a patch request to update a specific user's goal completion
function updateUserInGoal(app, database) {
    app.patch('/updateUserInGoal', async (req, res) => {
        try {
            // Ensures that the user being patched is in the goal with the passed-in id
            const filter = { _id: new ObjectId(req.body._id) };

            // Specifies the user that needs to be patched by using the userId
            const options = { arrayFilters: [{ 'user.userId': req.body.userId }] }

            // Passed as parameters in the PATCH request, updates the data under the specified key
            var update = { $set: { [req.body.updateKey]: req.body.updateValue } };

            // Send PATCH update to MongoDB!
            const result = await database.collection('goals').updateOne(filter, update, options);

            // Send successful status and the data of the result back to request
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send(`Ran into error ${error} while updating goal completion.`);
        }
    });
}

// Delete goal with given ObjectId in MongoDB
function deleteGoal(app, database) {
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


function updateGoalUsers(app, database) {
    app.patch('/updateGoalUsers/:type', async (req, res) => {
        try {
            // Define parameters of update request
            const filter = { _id: new ObjectId(req.body._id) };

            // Stores the update type / data
            let update;

            // If a new user is being added, push it to the end of the users array
            if (req.params.type === 'add') {
                update = { $push: { users: req.body.userObject } };
            } else {  // Otherwise (when removing), remove the user from the array of users by their userId
                update = { $pull: { users: { userId: req.body.userObject.userId } } }
            }

            // Update goal with matching ID to match the new users array
            const result = await database.collection('goals').updateOne(filter, update, { upsert: true });

            // Return a success message with result back
            res.status(200).send(result);
        } catch (error) {
            console.error("Error updating goal:", error);
            res.status(500).send("Server error while updating goal.");
        }
    });
};

// Export all HTTP router functions
module.exports = { createGoal, updateGoal, getGoals, updateUsersList, updateUserInGoal, deleteGoal, updateGoalUsers };