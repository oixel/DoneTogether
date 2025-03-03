// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { syncUserWithMongoDB, getUserData, UserData } from '../api';

interface MongoUser {
  _id: string;
  clerkId: string;
  email?: string;
  username?: string;
  profileImageUrl?: string;
  createdAt: string;
  lastUpdated: string;
}

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mongoUser, setMongoUser] = useState<MongoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Sync user data with MongoDB when user loads
    const syncUser = async () => {
      if (isLoaded && isSignedIn && user) {
        try {
          setLoading(true);
          
          // Create user data object from Clerk user
          const userData: UserData = {
            email: user.primaryEmailAddress?.emailAddress,
            username: user.username,
            profileImageUrl: user.imageUrl,
          };
          
          // Sync with MongoDB
          await syncUserWithMongoDB(userData);
          
          // Fetch latest data from MongoDB
          const data = await getUserData();
          setMongoUser(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setLoading(false);
        }
      } else if (isLoaded && !isSignedIn) {
        setLoading(false);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="user-profile">
        <img 
          src={user?.imageUrl} 
          alt="Profile" 
          className="profile-image" 
        />
        <h2>{user?.firstName} {user?.lastName}</h2>
        
        {/* Display username if available */}
        {user?.username && (
          <p className="username">@{user.username}</p>
        )}
        
        <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>
        
        {mongoUser && (
          <div className="mongo-data">
            <h3>Database Information</h3>
            <p>Username: {mongoUser.username || 'Not set'}</p>
            <p>First synced: {new Date(mongoUser.createdAt).toLocaleString()}</p>
            <p>Last updated: {new Date(mongoUser.lastUpdated).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;