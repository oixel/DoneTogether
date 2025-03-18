import axios from 'axios';

// Send a POST request to create a goal under the user who sent the creation request
export async function createGoal(name: string, description: string, user: any): Promise<void> {
    await axios.post('http://localhost:3001/goal', {
        name: name,
        description: description,
        ownerId: user.id,
        users: [{
            userId: user.id,
            joined: true,  // Owner does not need to accept an invitation
            completed: false
        }]
    })
}

// GET all the goals that a user is in
export async function getGoals(userId: string) {
    return await axios.get(`http://localhost:3001/getGoals/${userId}`);
}

// Send a PUT request to append a new user to the users array
export async function addUserToGoal(goalId: string, newUserObject: object): Promise<void> {
    await axios.put('http://localhost:3001/goal', { _id: goalId, newUserObject: newUserObject });
}

// Send a PATCH request to update the completion status of a user in a goal
export async function updateGoalCompletion(goalId: string, userId: string, completed: boolean): Promise<void> {
    // Update the completion status of the user with the given ID
    await axios.patch('http://localhost:3001/goal', { _id: goalId, userId: userId, completed: completed });
}

// Send a DELETE request to server based on this goal's ObjectId in MongoDB
export async function deleteGoal(id: string, setGoalUpdated: CallableFunction): Promise<void> {
    await axios.delete(`http://localhost:3001/goal/${id}`);
    setGoalUpdated(true);
}