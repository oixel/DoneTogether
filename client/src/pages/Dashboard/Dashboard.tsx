import React, { useState, useEffect } from 'react';
import "../../styles/globalStyles.css";
import "./Dashboard.css";
import "../../styles/popUp.css";
import elmo from '../../assets/elmo-profile-picture.jpg';
import { useUser, UserProfile, UserButton } from '@clerk/clerk-react';
// Changed from ReactComponent import to regular import
import beigeLogo from '../../assets/icons/logo-beige.svg';
import GoalList from '../../components/GoalList.tsx';  
import GoalPopUp from '../../components/GoalPopUp.tsx';
import { User } from '@clerk/nextjs/server';

// define Goal object
interface Goal {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  ownerID: number;
  username: string;
  goalID: number;
  collaborators: Collaborator[];
}

interface Collaborator {
  userID: number;
  username: string;
  completion: boolean;
}

const Dashboard: React.FC = () => {
  const [goalPopUpState, setGoalPopUpState] = useState<boolean>(false);
  const [goals, setGoals] = useState<Goal[]>([
    { title: "Exercise Regularly.", description: "Follow a daily workout routine.", startDate: '03/01/2025', endDate: '03/31/2025', ownerID: 12345, username: "goal_owner_1", goalID: 1, collaborators: [{ userID: 2, username: "john_doe", completion: false }, { userID: 3, username: "jane_smith", completion: true }] },
    { title: "Eat Healthier.", description: "Incorporate more vegetables into meals.", startDate: '03/01/2025', endDate: '03/31/2025', ownerID: 12345, username: "goal_owner_2", goalID: 2, collaborators: [{ userID: 4, username: "emily_jones", completion: true }, { userID: 5, username: "mark_brown", completion: false }] },
    { title: "Learn a New Language.", description: "Start learning Spanish with a daily lesson.", startDate: '03/01/2025', endDate: '03/31/2025', ownerID: 12345, username: "goal_owner_3", goalID: 3, collaborators: [{ userID: 6, username: "lucas_martin", completion: true }, { userID: 7, username: "ella_white", completion: false }] },
    { title: "Read More Books.", description: "Read 5 books this month.", startDate: '03/01/2025', endDate: '03/31/2025', ownerID: 12345, username: "goal_owner_4", goalID: 4, collaborators: [{ userID: 8, username: "sophia_black", completion: true }] },
    { title: "Meditate Daily.", description: "Meditate for 10 minutes every day.", startDate: '03/01/2025', endDate: '03/31/2025', ownerID: 12345, username: "goal_owner_5", goalID: 5, collaborators: [{ userID: 9, username: "william_davis", completion: true }, { userID: 10, username: "chloe_harris", completion: true }] },
    { title: "Save Money.", description: "Save $500 this month for future expenses.", startDate: '03/01/2025', endDate: '03/31/2025', ownerID: 12345, username: "goal_owner_6", goalID: 6, collaborators: [] }
  ]);


  const {isLoaded, user} = useUser();

  const userInfo = {
    email: user?.primaryEmailAddress?.emailAddress,
    username: user?.username,
    profileImageUrl: user?.imageUrl,
  };

  const userComponent = (
    <div className="user-card">
      <img src={userInfo.profileImageUrl} />
      <div className="user-card">{userInfo.username}</div>
      {/* you can add more user info here */}
      <div className="user-card">{userInfo.email}</div>
      <div className="user-card">User ID: {user?.id}</div>
      <UserButton />




    </div>
  );
  

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
        {/* Changed from BeigeLogo component to img tag */}
        <img src={beigeLogo} alt="Beige Logo" className="home-page-navbar-logo" />
        <div className="user-profile-frame">
          <img src={elmo} className="profile-image" alt="Profile" />
        </div>


        
      </div>
     
      {userComponent}

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

export default Dashboard;