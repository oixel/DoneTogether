
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

import { getGoals, updateUserInGoal, updateUsersList } from '../api/goalRequests';
import { getUserById } from '../api/userRequests';


// Import interface for GoalData object
import { GoalData } from '../types/goalData';

const Dashboard: React.FC = () => {
  const [addGoalPopUpState, setGoalPopUpState] = useState<boolean>(false);
  const navigate = useNavigate();

  // Goals stores the goals the user has joined. 
  // Invitations stores the goals the user has NOT joined.
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [invitations, setInvitations] = useState<GoalData[]>([]);
  const [usernames, setUsernames] = useState<{ [userId: string]: string }>({}); // <-- New state to store usernames

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();

   // Function to fetch username by userId
   const fetchUsername = useCallback(async (userId: string) => {
    if (usernames[userId]) return; // Don't refetch if already fetched
    try {
      const user = await getUserById(userId); // Assume this returns { username: string }
      if (user) {
        setUsernames(prev => ({ ...prev, [userId]: user.username }));
      }
    } catch (error) {
      console.error(`Failed to fetch username for user ${userId}:`, error);
    }
  }, [usernames]);

  // Refreshes goals list when set to true (in useEffect)
  const [needRefresh, setNeedRefresh] = useState(false);
  const [invitePopUp, setInvitePopUp] = useState<boolean>(false);

  

  const handleInviteClick = (): void => {
    setInvitePopUp(!invitePopUp);
  };

  const handleInviteResponse = async (goalId: string, response: boolean): Promise<void> => {
    console.log(`Invitation for goal ${goalId} ${response ? 'accepted' : 'declined'}`);
    // Here you would add the API call to accept/decline the invitation
    // After successful API call, you'd want to refresh the goals
    if (response) {
      await updateUserInGoal({
        _id: goalId,
        userId: user?.id,
        updateKey: 'users.$[user].joined',
        updateValue: true,
      });

      setNeedRefresh(true);
    } else {
      await updateUsersList(goalId, {
        userId: user?.id,
        joined: response
      }, 'remove');
      setNeedRefresh(true);
    }

    setNeedRefresh(true);
    // Close the popup if there are no more invitations
    if (invitations.length <= 1) {
      setInvitePopUp(false);
    }
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

  useEffect(() => {
    invitations.forEach(invite => {
      fetchUsername(invite._id); // or invite.userId depending on your data
    });
  }, [invitations, fetchUsername]);

  return (
    <div className="container">
      <div className="navbar">
        {/* Changed from BeigeLogo component to img tag */}
        <img src={beigeLogo} alt="Beige Logo" className="navbar-logo" style={{ cursor: 'pointer' }} onClick={handleLogoClick} />
        <p className='username-text'> Welcome back, {user?.username}.</p>
        {/* Envelope icon for invites */}
        <FaInbox className="envelope-icon" onClick={handleInviteClick} />

        {invitePopUp && (
          <div className="invite-popup">
            <h3 style={{ fontFamily: "'Rubik Doodle Shadow', sans-serif" }}>Your Invites</h3>
            <div className='invite-box'>
            {invitations.length === 0 ? (
              <p>You have no pending invitations.</p>
            ) : (
              <>
            <div className="invite-list">
              {invitations.map((invitation) => (
                
                
                
                <div key={invitation._id} className="invite-row">
                   <div key={invitation._id}>
                    {usernames[invitation._id] ? (
                      <p>{usernames[invitation._id]}</p>
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                  <span className="invite-goal-name">{invitation.name}</span>
                 
                  <div className="invite-buttons">
                    <button
                      className="accept-button"
                      onClick={() => handleInviteResponse(invitation._id, true)}
                    >
                      O
                    </button>
                    <button
                      className="decline-button"
                      onClick={() => handleInviteResponse(invitation._id, false)}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
            )}

            </div>
            <div className="invite-popup-footer">
            <button
              className="close-popup-button"
              onClick={() => setInvitePopUp(false)}
            >
              Close
            </button>
          </div>
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