import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton, useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import GoalsList from '../components/GoalsList';
import Notifications from '../components/Notifications';
import '../styles/Home.css';

const Home = () => {
  const { user } = useUser();
  const [goalsUpdated, setGoalsUpdated] = useState(false);
  
  // This will be used to refresh goals when notifications are handled
  const handleRequestsUpdate = () => {
    setGoalsUpdated(true);
  };

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
              <Notifications userId={user.id} onRequestsUpdate={handleRequestsUpdate} />
              <GoalsList />
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