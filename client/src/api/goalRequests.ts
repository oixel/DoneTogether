import axios from 'axios';

// Send a POST request to create a goal under the user who sent the creation request
export async function createGoal(name: string, description: string, userId: string, startDate: Date, endDate?: Date): Promise<void> {
    try {
        await axios.post('http://localhost:3001/goal', {
            name: name,
            description: description,
            ownerId: userId,
            startDate: startDate,
            endDate: endDate,
            users: [{
                userId: userId,
                joined: true,  // Owner does not need to accept an invitation
                completed: false
            }]
        });
    } catch (err) {
        console.error("Received error while creating goal: " + err)
    }
}

// Send a PATCH request to update the basic information about a goal
export async function updateGoal(_id: string, name: string, description: string, startDate: Date, endDate?: Date): Promise<void> {
    try {
        await axios.patch('http://localhost:3001/goal', {
            _id: _id,
            name: name,
            description: description,
            startDate: startDate,
            endDate: endDate
        });
    } catch (err) {
        console.error("Received error while updating goal: " + err);
    }
}

// GET all the goals that a user is in
export async function getGoals(userId: string) {
    return await axios.get(`http://localhost:3001/getGoals/${userId}`);
}

// Send a PATCH request to add or remove a user from a goal
export async function updateUsersList(goalId: string, userObject: object, updateType: 'add' | 'remove'): Promise<void> {
    await axios.patch(`http://localhost:3001/updateUsersList/${updateType}`, { _id: goalId, userObject: userObject });
}

// Send a PATCH request to update the user's data in a goal
export async function updateUserInGoal(updateData: object): Promise<void> {
    // Update the completion status of the user with the given ID
    await axios.patch('http://localhost:3001/updateUserInGoal', updateData);
}

// Send a DELETE request to server based on this goal's ObjectId in MongoDB
export async function deleteGoal(goalId: string): Promise<void> {
    await axios.delete(`http://localhost:3001/goal/${goalId}`);
}