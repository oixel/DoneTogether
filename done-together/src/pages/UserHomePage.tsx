import React, { useState, useEffect } from 'react';
import "../globalStyles.css";
import "../userHomePage.css";
import "../popUp.css";
import elmo from '../assets/elmo-profile-picture.jpg';
import { ReactComponent as BeigeLogo } from '../assets/icons/logo-beige.svg'; 
import GoalList from '../components/GoalList.tsx';  
import GoalPopUp from '../components/GoalPopUp.tsx'; 

// define Goal object
interface Goal { 
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  userID: number;
  // use userID (e.g. UFID) to get username (e.g. kkondapalli)
  goalID: number;
  // collaborators = [userIDs]

}

const UserHomePage: React.FC = () => {
  const [goalPopUpState, setGoalPopUpState] = useState<boolean>(false);
  const [goals, setGoals] = useState<Goal[]>([
    { title: "Drink More Water.", description: "lorem ipsum...", startDate: '03/08/2025', endDate: '03/15/2025', userID: 12345, goalID: 1 },
    { title: "Drink More Water.", description: "lorem ipsum...", startDate: '00/00/0000', endDate: '00/00/0000', userID: 12345, goalID: 2 },
    { title: "Drink More Water.", description: "lorem ipsum...", startDate: '00/00/0000', endDate: '00/00/0000', userID: 12345, goalID: 3 },
    { title: "Drink More Water.", description: "lorem ipsum...", startDate: '00/00/0000', endDate: '00/00/0000', userID: 12345, goalID: 4 },
    { title: "Drink More Water.", description: "lorem ipsum...", startDate: '00/00/0000', endDate: '00/00/0000', userID: 12345, goalID: 5 },
    { title: "Drink More Water.", description: "lorem ipsum...", startDate: '00/00/0000', endDate: '00/00/0000', userID: 12345, goalID: 6 },
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
        <BeigeLogo className="home-page-navbar-logo" />
        <div className="user-profile-frame">
          <img src={elmo} className="profile-image" alt="Profile" />
        </div>
      </div>
      
      <button onClick={handleClick} className="create-goal-button">+ Add Goal</button>

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
