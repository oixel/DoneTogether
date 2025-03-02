import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import Home from './pages/Home';

// Placeholder components
const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>This is the dashboard page. Content coming soon!</p>
    </div>
  );
};

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p>This is the profile page. Content coming soon!</p>
    </div>
  );
};

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/" replace />
      </SignedOut>
    </>
  );
};

// Debug component to show authentication state
const AuthDebug: React.FC = () => {
  const { isLoaded, userId, isSignedIn } = useAuth();
  
  return (
    <div className="fixed bottom-0 right-0 bg-white p-4 border shadow-lg text-xs">
      <pre>
        Auth state: {JSON.stringify({ isLoaded, userId, isSignedIn }, null, 2)}
      </pre>
    </div>
  );
};

const App: React.FC = () => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

  if (!clerkPubKey) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 text-red-700">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-2">Configuration Error</h1>
          <p>Missing Clerk Publishable Key</p>
          <p className="text-sm mt-4">
            Please add your Clerk publishable key to the .env file as VITE_CLERK_PUBLISHABLE_KEY
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Debug component - remove in production */}
        <AuthDebug />
      </BrowserRouter>
    </ClerkProvider>
  );
};

export default App;