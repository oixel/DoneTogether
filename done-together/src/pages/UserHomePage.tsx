import React, { useState, useEffect } from 'react';
import "../globalStyles.css";
import "../userHomePage.css";
import "../popUp.css";
import elmo from '../assets/elmo-profile-picture.jpg';
import envelope from '../assets/icons/envelopeicon.svg';
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

  const [invitePopUp, setInvitePopUp] = useState<boolean>(false);
  const collaborators = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank"];

  const handleClick = (): void => {
    setGoalPopUpState(!goalPopUpState);
  };

  const handleDelete = (goalID: number): void => {
    const newGoals = goals.filter(goal => goal.goalID !== goalID);
    setGoals(newGoals);
  };

  const handleInviteClick = (): void => {
    setInvitePopUp(!invitePopUp);
  };


  const handleInviteResponse = (collaborator: string, response: boolean): void => {
    console.log(`${collaborator} invite ${response ? 'accepted' : 'declined'}`);
  };

  useEffect(() => {
    console.log("Use Effect Ran!");
  }, []);


  return (
    <div className="container">
      <div className="navbar">
      <BeigeLogo className="home-page-navbar-logo" />
      <div className="nav-icons">
        <button className="envelope-button"  onClick={handleInviteClick}>
          <img src={envelope} className="envelope-icon" alt="Messages" />
        </button>
      
        {invitePopUp && (
            <div className="invite-popup">
              <p>You have new invites. Accept?</p>
              <div className="users-co">
                {/* Iterate through collaborators and display them in individual rows */}
                {collaborators.slice(0, collaborators.length).map((collaborator, index) => (
                  <div className="collaborator-box" key={index}>
                    <img src={elmo} className="collaborator-image" alt="collaborator image" />
                    <p>{collaborator}</p>
                    <div>
                      <button onClick={() => handleInviteResponse(collaborator, true)}>Yes</button>
                      <button onClick={() => handleInviteResponse(collaborator, false)}>No</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        <div className="user-profile-frame">
          <img src={elmo} className="profile-image" alt="Profile" />
        </div>
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
