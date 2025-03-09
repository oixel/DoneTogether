// src/App.tsx - Cleaned up version with separate page components
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import LandingPage from './pages/LandingPage/LandingPage';
import AboutUs from './pages/AboutUs/AboutUs';
import NotFound from './pages/404 Page/NotFound';
import './styles/updated-clerk-styles.css' // Import the Clerk styling

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
        baseTheme: undefined, // Remove base theme to allow more customization
        variables: {
          // Colors that match your site
          colorPrimary: '#6B7E5E',           // Olive green for primary elements
          colorText: '#4e4e4e',              // Dark gray for text
          colorTextOnPrimaryBackground: '#FFFFFF',  // White for text on colored backgrounds
          colorBackground: '#f2f0e6',        // Off-white/beige background matching your site
          colorInputBackground: '#FFFFFF',   // White background for inputs
          colorInputText: '#333333',         // Dark text for inputs
          colorDanger: '#B05D5D',            // Muted red for errors/danger
          colorSuccess: '#71944A',           // Green for success states
          fontFamily: 'Georgia, serif',      // Serif font to match your design
          borderRadius: '24px',              // Rounded corners for elements
        },
        elements: {
          // Card styling
          card: 'shadow-md bg-[#f2f0e6] border-0',
          
          // Make the form header match your site's typography
          headerTitle: 'text-2xl font-normal text-[#4e4e4e]',
          headerSubtitle: 'text-[#6B7E5E] font-light',
          
          // Form fields
          formButtonPrimary: 'bg-[#6B7E5E] hover:bg-[#5A6B4F] px-6 py-2 text-white rounded-full relative font-normal',
          formButtonReset: 'text-[#6B7E5E] hover:text-[#5A6B4F]',
          formFieldLabel: 'text-[#4e4e4e] font-medium',
          formFieldInput: 'border-2 border-[#e0dfd5] focus:border-[#6B7E5E] focus:ring-1 focus:ring-[#6B7E5E] rounded-lg bg-white',
          
          // Footer elements
          footerActionLink: 'text-[#6B7E5E] hover:text-[#5A6B4F] text-base',
          
          // Add a custom larger size to the logo
          logoImage: 'w-20 h-20 mx-auto my-5',
          
          // Social buttons
          socialButtonsIconButton: 'border-2 border-[#e0dfd5] hover:border-[#6B7E5E]',
          socialButtonsBlockButton: 'border-2 border-[#e0dfd5] hover:border-[#6B7E5E] hover:bg-[#f9f7ef]',
          
          // Footer power by section
          footerActionText: 'text-base',
          footer: 'py-5',
        },
        layout: {
          logoPlacement: 'inside',
          showOptionalFields: true,
          socialButtonsPlacement: 'bottom',
          logoImageUrl: '/src/assets/icons/logo-dark-green.svg' // Use your own logo
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
                  <h1>Dashboard</h1>
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