import React, { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import GoalList from '../../components/GoalList.tsx';
import GoalPopUp from '../../components/GoalPopUp.tsx';
import EditGoalPopUp from '../../components/EditGoalPopUp.tsx' // Import the new component
import "../../styles/popUp.css";
import "../../styles/globalStyles.css";
import "./Dashboard.css";
import beigeLogo from '../../assets/icons/logo-beige.svg';

// Define Goal object
interface Goal {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  userID: number;
  goalID: number;
}

const Dashboard: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [goalPopUpState, setGoalPopUpState] = useState<boolean>(false);
  const [editPopUpState, setEditPopUpState] = useState<boolean>(false);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [goals, setGoals] = useState<Goal[]>([
    { title: "Drink More Water", description: "Drink at least 8 glasses of water daily", startDate: '03/08/2025', endDate: '03/15/2025', userID: 12345, goalID: 1 },
    { title: "Exercise Regularly", description: "Go to the gym 3 times a week", startDate: '03/10/2025', endDate: '04/10/2025', userID: 12345, goalID: 2 },
    { title: "Read More Books", description: "Read at least 2 books per month", startDate: '03/12/2025', endDate: '03/20/2025', userID: 12345, goalID: 3 },
    { title: "Learn a New Skill", description: "Study React and TypeScript for 1 hour daily", startDate: '03/15/2025', endDate: '04/15/2025', userID: 12345, goalID: 4 },
    { title: "Meditate Daily", description: "Meditate for 10 minutes each morning", startDate: '03/20/2025', endDate: '04/20/2025', userID: 12345, goalID: 5 },
    { title: "Improve Sleep Schedule", description: "Go to bed by 10:30 PM every night", startDate: '03/25/2025', endDate: '04/25/2025', userID: 12345, goalID: 6 },
  ]);
  
  const handleClick = (): void => {
    setGoalPopUpState(true);
  };
  
  const handleDelete = (goalID: number): void => {
    const newGoals = goals.filter(goal => goal.goalID !== goalID);
    setGoals(newGoals);
  };

  const handleAddGoal = (newGoal: Omit<Goal, 'goalID'>): void => {
    // Generate a unique ID for the new goal
    const newGoalId = Math.max(...goals.map(goal => goal.goalID), 0) + 1;
    
    // Add the new goal to the goals array
    setGoals([...goals, { ...newGoal, goalID: newGoalId }]);
  };
  
  const handleAddCollaborator = (goalID: number): void => {
    console.log("Adding collaborator to goal:", goalID);
    // Implement collaborator addition logic here
  };
  
  const handleEditDates = (goalID: number): void => {
    // Find the goal to edit
    const goalToEdit = goals.find(goal => goal.goalID === goalID);
    if (goalToEdit) {
      setCurrentGoal(goalToEdit);
      setEditPopUpState(true);
    }
  };
  
  const handleEditGoal = (goalID: number): void => {
    // Find the goal to edit
    const goalToEdit = goals.find(goal => goal.goalID === goalID);
    if (goalToEdit) {
      setCurrentGoal(goalToEdit);
      setEditPopUpState(true);
    }
  };
  
  const handleUpdateGoal = (updatedGoal: Goal): void => {
    // Update the goal in the goals array
    const updatedGoals = goals.map(goal => 
      goal.goalID === updatedGoal.goalID ? updatedGoal : goal
    );
    
    setGoals(updatedGoals);
  };
  
  // Stop propagation for modal container to prevent click events from bubbling
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Fetch user goals on component mount or when user changes
  useEffect(() => {
    if (isLoaded && user) {
      console.log("User logged in:", user.id);
      // Here you would typically fetch user-specific goals from your backend
    }
  }, [isLoaded, user]);
  
  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return <div className="loading-container">Loading...</div>;
  }
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo-container">
          <img src={beigeLogo} className="logo" alt="Logo" />
        </div>
        <div className="user-controls">
          {user && (
            <span className="welcome-text">Welcome, {user.firstName || user.username || 'Friend'}!</span>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      
      <div className="dashboard-content">
        <div className="goals-header">
          <h1>Your Goals</h1>
          <button onClick={handleClick} className="add-goal-button">+ Add Goal</button>
        </div>
        
        {/* Pass goals and handlers to the GoalList component */}
        {goals.length > 0 ? (
          <GoalList 
            goals={goals} 
            handleDelete={handleDelete}
            onAddCollaborator={handleAddCollaborator}
            onEditDates={handleEditDates}
            onEditGoal={handleEditGoal} 
          />
        ) : (
          <div className="no-goals-message">
            <p>You haven't created any goals yet.</p>
            <button onClick={handleClick} className="create-first-goal-button">Create your first goal</button>
          </div>
        )}
      </div>
      
      {/* Popup for adding new goals */}
      {goalPopUpState && (
        <>
          <div className="overlay active" onClick={() => setGoalPopUpState(false)}></div>
          <div onClick={stopPropagation}>
            <GoalPopUp 
              setGoalPopUpState={setGoalPopUpState} 
              onAddGoal={handleAddGoal}
            />
          </div>
        </>
      )}
      
      {/* Popup for editing existing goals */}
      {editPopUpState && currentGoal && (
        <>
          <div className="overlay active" onClick={() => setEditPopUpState(false)}></div>
          <div onClick={stopPropagation}>
            <EditGoalPopUp 
              setEditPopUpState={setEditPopUpState}
              onEditGoal={handleUpdateGoal}
              goal={currentGoal}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;