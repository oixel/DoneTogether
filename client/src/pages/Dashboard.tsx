// src/pages/Dashboard.tsx
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { isLoaded, user } = useUser();

  // Display loading text while user's information gets loaded
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="user-profile">
        <img
          src={user?.imageUrl}
          alt="Profile image"
          className="profile-image"
        />
        <h2>{user?.firstName} {user?.lastName}</h2>

        {/* Display username if available */}
        {user?.username && (
          <p className="username"><b>Username:</b> {user.username}</p>
        )}

        <p><b>Email:</b> {user?.primaryEmailAddress?.emailAddress}</p>

        <Link to='/'>Back to Home</Link>
      </div>
    </div>
  );
};

export default Dashboard;