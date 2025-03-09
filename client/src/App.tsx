// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import LandingPage from './pages/LandingPage';
import './styles/App.css';
import './styles/globalStyles.css'

// Get publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}
      afterSignOutUrl={'/signout'}
      appearance={{
        variables: {
          colorPrimary: '#6B7E5E', // Olive green from your design
          colorBackground: '#FFFFFF',
          colorText: '#333333',
          colorInputText: '#333333',
          colorInputBackground: '#FFFFFF',
          borderRadius: '12px',
        },
        elements: {
          card: 'custom-clerk-card',
          formButtonPrimary: 'custom-continue-button',
          formFieldInput: 'custom-input-field',
          headerTitle: 'custom-header',
          headerSubtitle: 'custom-subtitle',
          logoImage: 'custom-logo',
        },
        layout: {
          logoPlacement: 'inside',
          showOptionalFields: true,
          socialButtonsPlacement: 'bottom'
        }
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />

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

          <Route path="/signout"
            element={
              <SignOut />
            }
          />

          {/* Redirects all unknown routes to 404 page */}
          <Route path="*" element={<Page404 />} />

        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;