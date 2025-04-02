// src/App.tsx - Simplified with minimal styling in the file
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import LandingPage from './pages/LandingPage';
import AboutUs from './pages/AboutUs';
import NotFound from './pages/NotFound';
import './styles/updated-clerk-styles.css'; // Import the Clerk styling
import Dashboard from './pages/Dashboard';

// Get publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

function App() {
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      afterSignOutUrl={'/signout'}
      appearance={{
        variables: {
          colorPrimary: '#6B7E5E',
          colorBackground: '#f2f0e6',
          colorText: '#4e4e4e',
          fontFamily: 'Georgia, serif',
          borderRadius: '24px',
        },
        layout: {
          logoPlacement: 'inside',
          showOptionalFields: true,
          socialButtonsPlacement: 'bottom',
          logoImageUrl: '/src/assets/icons/logo-dark-green.svg'
        }
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/aboutUs" element={<AboutUs />} />

          {/* Protected route */}
          <Route
            path="/dashboard"
            element={
              <>
                <SignedIn>
                  <Dashboard />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;