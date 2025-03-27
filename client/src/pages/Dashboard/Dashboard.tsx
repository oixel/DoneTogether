import React, { useState, useEffect } from 'react';
import "../../styles/globalStyles.css";
import "./Dashboard.css";
import "../../styles/popUp.css";
import { useUser, UserButton } from '@clerk/clerk-react';
// Changed from ReactComponent import to regular import
import beigeLogo from '../../assets/icons/logo-beige.svg';
import GoalList from '../../components/GoalList.tsx';  
import GoalPopUp from '../../components/GoalPopUp.tsx';
import LandingPage from '../LandingPage/LandingPage';
import { useNavigate } from 'react-router-dom';


// define Goal object
interface Goal {  
  name: string;
  description: string;
  ownerID: string; 
  users: goalUser[];
  
  startDate: string;
  endDate: string;
}

interface goalUser {
  userID: string;
  joined: boolean;
  completion: boolean;
}

const Dashboard: React.FC = () => {
  const [addGoalPopUpState, setGoalPopUpState] = useState<boolean>(false);
  const navigate = useNavigate();

  const [goals, setGoals] = useState<Goal[]>([
    { name: "Complete a Full Marathon", description: "Train for and run a full marathon in three months.", startDate: '03/01/2025', endDate: '05/31/2025', ownerID: "john_doe_54321", users: [{ userID: "john_doe_54321", completion: false, joined: true }, { userID: "david_lee_11", completion: false, joined: true }, { userID: "sarah_kim_12", completion: true, joined: true }] },
    { name: "Launch a Personal Blog", description: "Create and publish 10 blog posts within a month.", startDate: '03/01/2025', endDate: '03/31/2025', ownerID: "jane_smith_54322", users: [{ userID: "jane_smith_54322", completion: true, joined: true }, { userID: "mike_jones_13", completion: true, joined: true }] },
    { name: "Master Cooking Skills", description: "Learn and prepare 20 new recipes over the next two months.", startDate: '03/01/2025', endDate: '04/30/2025', ownerID: "lucy_brown_54323", users: [{ userID: "lucy_brown_54323", completion: false, joined: true }, { userID: "mark_white_14", completion: false, joined: true }] },
    { name: "Read 12 Books This Year", description: "Read 12 books, one every month, and keep a journal of each book.", startDate: '03/01/2025', endDate: '12/31/2025', ownerID: "alice_green_54324", users: [{ userID: "alice_green_54324", completion: false, joined: true }, { userID: "charles_davis_15", completion: false, joined: true }] },
    { name: "Save $1000 This Quarter", description: "Set aside $1000 over the next 3 months for future financial goals.", startDate: '03/01/2025', endDate: '05/31/2025', ownerID: "robert_clark_54325", users: [{ userID: "robert_clark_54325", completion: false, joined: true }] },
    { name: "Learn to Play Guitar", description: "Complete 30 practice sessions over the next two months to learn basic chords and songs.", startDate: '03/01/2025', endDate: '04/30/2025', ownerID: "emma_lee_54326", users: [{ userID: "emma_lee_54326", completion: true, joined: true }, { userID: "will_taylor_16", completion: false, joined: true }] }
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
  
  const handleCreateClick = (): void => {
    setGoalPopUpState(!addGoalPopUpState);
  };

  const handleLogoClick = (): void => {
    navigate('/');
  };

  const customAppearance = {
    elements: {
    },
  };


  useEffect(() => {
    console.log("Use Effect Ran!");
  }, []);

  return (
    <div className="container">
      <div className="navbar">
        {/* Changed from BeigeLogo component to img tag */}
        <img src={beigeLogo} alt="Beige Logo" className="navbar-logo" onClick={handleLogoClick} />
        <UserButton appearance={customAppearance}/>
      </div>

      {userComponent}

      <button onClick={handleCreateClick} className="create-goal-button">+ Add Goal</button>


      {addGoalPopUpState && <div className="overlay active"></div>}
      {addGoalPopUpState && (
        <div>
          <GoalPopUp setGoalPopUpState={setGoalPopUpState} />
        </div>
      )}
      <GoalList goals={goals} />
      
    </div>
  );
};

export default Dashboard;