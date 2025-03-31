import React, { useState, useEffect, useCallback } from 'react';
import { SignedIn, SignedOut, useUser, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

// Changed from ReactComponent import to regular import
import beigeLogo from '../assets/icons/logo-beige.svg';
import GoalList from '../components/GoalList.tsx';
import GoalPopUp from '../components/GoalPopUp.tsx';
import { FaInbox } from 'react-icons/fa';

import "../styles/globalStyles.css";
import "../styles/Dashboard.css";
import "../styles/popUp.css";

import { getGoals } from '../api/goalRequests';


// Import interface for GoalData object
import { GoalData } from '../types/goalData';

const Dashboard: React.FC = () => {
  const [addGoalPopUpState, setGoalPopUpState] = useState<boolean>(false);
  const navigate = useNavigate();

  // Goals stores the goals the user has joined. 
  // Invitations stores the goals the user has NOT joined.
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [invitations, setInvitations] = useState<GoalData[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();

  // Refreshes goals list when set to true (in useEffect)
  const [needRefresh, setNeedRefresh] = useState(false);
  const [invitePopUp, setInvitePopUp] = useState<boolean>(false);

  const collaborators = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank"];

  const handleInviteClick = (): void => {
    setInvitePopUp(!invitePopUp);
  };

  const handleInviteResponse = (collaborator: string, response: boolean): void => {
    console.log(`${collaborator} invite ${response ? 'accepted' : 'declined'}`);
  };

  const toggleCreationPopUp = (): void => {
    setGoalPopUpState(!addGoalPopUpState);
  };

  const handleLogoClick = (): void => {
    navigate('/');
  };

  const customAppearance = {
    elements: {
      userButtonAvatarBox: {
        width: "2.5vw",
        height: "2.5vw",
      },
      userButtonAvatarImage: {
        width: "2.5vw",
        height: "2.5vw",
      },
    }
  };

  // Function to fetch goals/invitations from the server;
  // Using Callback to prevent unnecessarry re-renders from the useEffect call
  const getGoalsAndInvitations = useCallback(async () => {
    setIsLoading(true);

    // Place in try/catch to prevent code breaking if an error arises
    try {
      if (user) {
        const result = await getGoals(user.id);

        // Temporarily stores the goals and invites being sifted through
        const newGoals: Array<GoalData> = [];
        const newInvitations: Array<GoalData> = [];

        // Filter through users goals here and append to goals or invites array based on the joined boolean
        result.data.goals.forEach((goalObject: GoalData) => {
          const userData = goalObject.users.find(({ userId }) => userId === user.id);

          // Append data the current goal to goals if user has joined or invitations if user has yet to accept the invite
          if (userData) {
            if (userData.joined) newGoals.push(goalObject);
            else newInvitations.push(goalObject);
          } else {
            setError("Error loading goals. Found goal without data.");
          }
        });

        // When goals and invites and sifted through, place each in their respective arrays
        setGoals(newGoals);
        setInvitations(newInvitations);

        // If goals and invites are loaded properly, wipe any errors that may have existed
        setError(null);
      }
      else {
        setError("Failed to find user.")
      }
    } catch (err) {
      // Output error if error comes up while loading goals
      console.error("Error fetching goals:", err);
      setError("Failed to load goals. Please try again.");
    } finally {
      // When done loading goals/invites, remove the loading text
      setIsLoading(false);
    }
  }, [user]);

  // Refresh Home page content when user is updated
  useEffect(() => {
    getGoalsAndInvitations();
  }, [user, getGoalsAndInvitations]);

  // Refresh Home page content when content is change and a refresh is needed
  useEffect(() => {
    if (needRefresh) {
      getGoalsAndInvitations();
      setNeedRefresh(false)
    }
  }, [needRefresh, getGoalsAndInvitations]);

  return (
    <div className="container">
      <div className="navbar">
        {/* Changed from BeigeLogo component to img tag */}
        <img src={beigeLogo} alt="Beige Logo" className="navbar-logo" style={{ cursor: 'pointer' }} onClick={handleLogoClick} />
        <p className='username-text'> Welcome back, {user?.username}.</p>
        {/* Envelope icon for invites */}

        <FaInbox className="envelope-icon" onClick={handleInviteClick}/>

        {invitePopUp && (
          <div className="invite-popup">
            <p>You have new invites. Accept?</p>
            {collaborators.map((collaborator) => (
              <div key={collaborator} className="invite-row">
                <span>{collaborator}</span>
                <button onClick={() => handleInviteResponse(collaborator, true)}>Yes</button>
                <button onClick={() => handleInviteResponse(collaborator, false)}>No</button>
              </div>
            ))}
          </div>
        )}
        <UserButton appearance={customAppearance} />
      </div>

      <SignedIn>
        {user && (
          <>
            {addGoalPopUpState && <div className="overlay active"></div>}
            {addGoalPopUpState && (
              <div>
                <GoalPopUp
                  setGoalPopUpState={setGoalPopUpState}
                  setNeedRefresh={setNeedRefresh}
                  ownerId={user.id}
                />
              </div>
            )}
            <GoalList
              goals={goals}
              currentUserId={user.id}
              setNeedRefresh={setNeedRefresh}
              isLoading={isLoading}
              error={error}
            />
            <div className="overlay-buttons">
              <button
                onClick={toggleCreationPopUp}
                className="create-goal-button"
              >
                + Add Goal
              </button>
              <button
                className="refresh-button"
                onClick={() => setNeedRefresh(true)}
              >
                 ⟳ 
              </button>
            </div>
          </>
        )}
      </SignedIn>
      <SignedOut>
        <p>Please sign in to see your goals!</p>
      </SignedOut>
    </div>
  )
};

export default Dashboard;