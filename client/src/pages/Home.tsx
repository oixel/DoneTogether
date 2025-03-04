
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/clerk-react';
import GoalsList from '../components/GoalsList';

import '../styles/Home.css';

const Home = () => {

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
          <GoalsList />
        </SignedIn>

        <SignedOut>
          <p>Please sign in to see your goals!</p>
        </SignedOut>
      </div>
    </div>
  );
};

export default Home;