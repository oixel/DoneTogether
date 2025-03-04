import React, { useState, useEffect } from 'react';
import "../globalStyles.css";
import "../userHomePage.css";
import elmo from '../assets/elmo-profile-picture.jpg';
import BeigeLogo from '../assets/icons/logo-beige.svg'; // im confused why this is not working
import GoalList from '../components/GoalList.tsx';  
import GoalPopUp from '../components/GoalPopUp.tsx'; 

interface Goal {
  title: string;
  description: string;
  date: string;
  userID: number;
  goalID: number;

}

const UserHomePage: React.FC = () => {
  const [goalPopUpState, setGoalPopUpState] = useState<boolean>(false);
  const [goals, setGoals] = useState<Goal[]>([
    { title: "Drink More Water.", description: "lorem ipsum...", date: '00/00/0000', userID: 12345, goalID: 1 },
    { title: "Drink More Water.", description: "lorem ipsum...", date: '00/00/0000', userID: 12345, goalID: 2 },
    { title: "Drink More Water.", description: "lorem ipsum...", date: '00/00/0000', userID: 12345, goalID: 3 },
    { title: "Drink More Water.", description: "lorem ipsum...", date: '00/00/0000', userID: 12345, goalID: 4 },
    { title: "Drink More Water.", description: "lorem ipsum...", date: '00/00/0000', userID: 12345, goalID: 5 },
    { title: "Drink More Water.", description: "lorem ipsum...", date: '00/00/0000', userID: 12345, goalID: 6 },
  ]);

  const handleClick = (): void => {
    setGoalPopUpState(!goalPopUpState);
  };

  const handleDelete = (goalID: number): void => {
    const newGoals = goals.filter(goal => goal.goalID !== goalID);
    setGoals(newGoals);
  };

  useEffect(() => {
    console.log("Use Effect Ran!");
  }, []);

  return (
    <div className="container">
      <div className="navbar">
        {/* <BeigeLogo className="home-page-navbar-logo" /> need to check again*/}
        <div className="user-profile-frame">
          <img src={elmo} className="profile-image" alt="Profile" />
        </div>
      </div>
      <button onClick={handleClick} className="create-goal-button">
        + Add Goal {goalPopUpState ? 1 : 0}
      </button>

      {goalPopUpState && <div className="overlay active"></div>}
      {goalPopUpState && (
        <div>
          <GoalPopUp setGoalPopUpState={setGoalPopUpState} />
        </div>
      )}
      <GoalList goals={goals} handleDelete={handleDelete} />
    </div>
  );
};

export default UserHomePage;
