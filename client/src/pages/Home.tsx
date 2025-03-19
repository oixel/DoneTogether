import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton, useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import GoalsList from '../components/GoalsList';
import NotificationsList from '../components/NotificationsList';
import '../styles/Home.css';

import { getGoals } from '../api/goalRequests';

// Define interface for User objects in MongoDB
interface UserObject {
  userId: string;
  joined: boolean;
  completed: boolean;
}

// Define interface for Goal objects in MongoDB
interface GoalData {
  _id: string;
  name: string;
  description: string;
  ownerId: string;
  users: Array<UserObject>;
}

const Home = () => {
  const { user } = useUser();

  const [goals, setGoals] = useState([]);
  const [invitations, setInvitations] = useState([]);

  const [goalsUpdated, setGoalsUpdated] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // This will be used to refresh goals when notifications are handled
  // const handleRequestsUpdate = () => {
  //   setGoalsUpdated(true);
  // };

  // Function to fetch goals/invitations from the server
  async function getGoalsAndInvitations(): Promise<void> {
    // 
    setIsLoading(true);

    // 
    try {
      const result = await getGoals(user.id);

      const newGoals: Array<GoalData> = [];
      const newInvitations: Array<GoalData> = [];

      // Filter through users goals here and append to goals or invites array based on the joined boolean
      result.data.goals.forEach(goalObject => {
        const userData = goalObject.users.find(({ userId }) => userId === user.id);
        if (userData.joined) newGoals.push(goalObject);
        else newInvitations.push(goalObject);
      });

      setGoals(newGoals);
      setInvitations(newInvitations);

      setError(null);
    } catch (err) {
      console.error("Error fetching goals:", err);
      setError("Failed to load goals. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // 
  useEffect(() => {
    if (user) getGoalsAndInvitations();
  }, [user])

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