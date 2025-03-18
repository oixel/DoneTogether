import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import Goal from './Goal';

import { createGoal } from '../api/goalRequests';

// Define interface for User objects in MongoDB
interface UserObject {
  userId: string;
  joined: boolean;
  completed: boolean;
}

// Define interface for Goal objects in MongoDB
interface GoalData {
  _id: string;
  name: string;
  description: string;
  ownerId: string;
  users: Array<UserObject>;
}

// Defines types for the props of GoalsList component
interface GoalsListProps {
  goals: Array<GoalData>;
  getGoalsAndInvitations: CallableFunction;
  isLoading: boolean;
  error: string;
  setError: CallableFunction;
}

function GoalsList({ goals, getGoalsAndInvitations, isLoading, error, setError }: GoalsListProps) {
  const { user } = useUser();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [goalsUpdated, setGoalsUpdated] = useState<boolean>(false);


  // Fetch goals when component mounts or when goals are updated
  useEffect(() => {
    if (goalsUpdated) {
      setGoalsUpdated(false);
    }
  }, [goalsUpdated, user]);

  // Function to create a new goal
  async function handleGoalCreation(): Promise<void> {
    if (!user || !name) return;

    try {
      // 
      createGoal(name, description, user);

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
        <button onClick={() => getGoalsAndInvitations()}>Try Again</button>
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
            onClick={handleGoalCreation}
            disabled={!name}
          >
            Create Goal +
          </button>
          <button
            className="refreshButton"
            onClick={() => getGoalsAndInvitations()}
          >
            🔃
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoalsList;