
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/clerk-react';
import './Home.css';

const Home = () => {

  return (
    <div className="container">
      <header>
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
    </div>
  );
};

export default Home;