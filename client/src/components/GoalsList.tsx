import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import Goal from './Goal';

import { createGoal } from '../api/goalRequests';

// Import interface for GoalData object
import { GoalData } from '../types/goalData';

// Defines types for the props of GoalsList component
interface GoalsListProps {
  goals: Array<GoalData>;
  isLoading: boolean;
  setNeedRefresh: CallableFunction;
  error: string | null;
  setError: CallableFunction;
}

function GoalsList({ goals, isLoading, setNeedRefresh, error, setError }: GoalsListProps) {
  const { user } = useUser();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Function to create a new goal
  async function handleGoalCreation(): Promise<void> {
    if (!user || !name) return;

    try {
      // Send an axios request with the goal's data and the user's id (to add the owner to the goal!)
      await createGoal(name, description, user.id);

      // Clear input fields
      const nameInput = document.getElementById('nameInput') as HTMLInputElement;
      const descInput = document.getElementById('descriptionInput') as HTMLInputElement;
      if (nameInput) nameInput.value = '';
      if (descInput) descInput.value = '';

      // Refresh goals list
      setNeedRefresh(true);
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
        <button onClick={() => setNeedRefresh(true)}>Try Again</button>
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
              mongoDBUserData={goal.users}
              //@ts-expect-error user is not null cause this component will only be shown during a signed in state
              currentUserId={user.id}
              setNeedRefresh={setNeedRefresh}
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
            onClick={() => handleGoalCreation()}
            disabled={!name}
          >
            Create Goal +
          </button>
          <button
            className="refreshButton"
            onClick={() => setNeedRefresh(true)}
          >
            🔃
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoalsList;