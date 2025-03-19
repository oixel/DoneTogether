import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton, useUser } from '@clerk/clerk-react';
import { useState, useEffect, useCallback } from 'react';
import GoalsList from '../components/GoalsList';
import NotificationsList from '../components/NotificationsList';
import '../styles/Home.css';

import { getGoals } from '../api/goalRequests';

// Import interface for GoalData object
import { GoalData } from '../types/goalData';

const Home = () => {
  const { user } = useUser();

  const [goals, setGoals] = useState<GoalData[]>([]);
  const [invitations, setInvitations] = useState<GoalData[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Refreshes goals when set to true (in useEffect)
  const [needRefresh, setNeedRefresh] = useState(false);

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
      <header style={{ paddingBottom: '30px' }}>
        <h1>DoneTogether</h1>
        <nav>
          <SignedIn>
            <Link to="/dashboard" className="sign-up-button">Dashboard</Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="sign-in-button">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="sign-up-button">Sign Up</button>
            </SignUpButton>
          </SignedOut>
        </nav>
      </header>
      <div>
        <SignedIn>
          {user && (
            <>
              <NotificationsList
                userId={user.id}
                invitations={invitations}
              />
              <GoalsList
                goals={goals}
                getGoalsAndInvitations={getGoalsAndInvitations}
                isLoading={isLoading}
                error={error}
                setError={setError}
              />
            </>
          )}
        </SignedIn>
        <SignedOut>
          <p>Please sign in to see your goals!</p>
        </SignedOut>
      </div>
    </div>
  );
};

export default Home;