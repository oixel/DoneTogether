import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';

import { BrowserRouter, Routes, Route } from "react-router";

import Home from './pages/Home';
import Profile from './pages/Profile';
import LogOut from './pages/LogOut';
import PageNotFound from './pages/PageNotFound'

// FOR TESTING SERVER
import ServerTesting from './pages/ServerTesting';

import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />

        <Route path="logout" element={<LogOut />} />

        <Route path="server-testing" element={<ServerTesting />} />

        {/* Redirects any unknown routes to PageNotFound */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter >
  </Auth0Provider >
);