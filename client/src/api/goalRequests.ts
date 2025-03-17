import axios from 'axios';

// Send a DELETE request to server based on this goal's ObjectId in MongoDB
export async function deleteGoal(id: string, setGoalUpdated: CallableFunction): Promise<void> {
    await axios.delete(`http://localhost:3001/goal/${id}`);
    setGoalUpdated(true);
}

// Send a PATCH request to update the completion status of a user in a goal
export async function updateGoalCompletion(goalId: string, userId: string, completed: boolean) {
    // Update the completion status of the user with the given ID
    await axios.patch('http://localhost:3001/goal', { _id: goalId, userId: userId, completed: completed });
}