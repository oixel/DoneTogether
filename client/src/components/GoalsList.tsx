import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import Goal from './Goal';

// Define interfaces for your data structures
interface GoalData {
  _id: string;
  name: string;
  description: string;
  ownerId: string;
  users: Array<UserObject>;
}

interface UserObject {
  userId: string;
  joined: boolean;
  completed: boolean;
}

function GoalsList() {
  const { user } = useUser();
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [goalsUpdated, setGoalsUpdated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch goals when component mounts or when goals are updated
  useEffect(() => {
    getGoals();
    if (goalsUpdated) {
      setGoalsUpdated(false);
    }
  }, [goalsUpdated, user]);

  // Function to fetch goals from the server
  async function getGoals(): Promise<void> {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await axios.get(`http://localhost:3001/getGoals/${user.id}`);
      setGoals(result.data.goals || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching goals:", err);
      setError("Failed to load goals. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Function to create a new goal
  async function createGoal(): Promise<void> {
    if (!user || !name) return;

    try {
      await axios.post('http://localhost:3001/goal', {
        name: name,
        description: description,
        ownerId: user.id,
        users: [{
          userId: user.id,
          joined: true,  // Owner does not need to accept an invitation
          completed: false
        }]
      });

      // Clear input fields
      const nameInput = document.getElementById('nameInput') as HTMLInputElement;
      const descInput = document.getElementById('descriptionInput') as HTMLInputElement;
      if (nameInput) nameInput.value = '';
      if (descInput) descInput.value = '';

      // Update goals list
      setGoalsUpdated(true);
    } catch (err) {
      console.error("Error creating goal:", err);
      setError("Failed to create goal. Please try again.");
    }
  }

  // Show loading state
  if (isLoading && !goals.length) {
    return <div className="loading">Loading goals...</div>;
  }

  // Show error state
  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={getGoals}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="goalsListContainer">
      <div className="goalsDiv">
        {goals.length > 0 ? (
          goals.map(goal => (
            <Goal
              key={goal._id}
              id={goal._id}
              name={goal.name}
              description={goal.description}
              ownerId={goal.ownerId}
              users={goal.users as UserObject[]}
              setGoalUpdated={setGoalsUpdated}
              //@ts-expect-error user is not null cause this component will only be shown during a signed in state
              currentUserId={user.id}
            />
          ))
        ) : (
          <div className="no-goals">You have no goals yet...</div>
        )}
      </div>
      <div className="createContainer">
        <div>
          <label htmlFor="nameInput">Goal Name:</label>
          <input
            name="nameInput"
            id="nameInput"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="descriptionInput">Goal Description:</label>
          <input
            name="descriptionInput"
            id="descriptionInput"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={createGoal}
            disabled={!name}
          >
            Create Goal +
          </button>
          <button
            className="refreshButton"
            onClick={getGoals}
          >
            🔃
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoalsList;