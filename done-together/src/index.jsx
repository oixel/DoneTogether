import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';

import { BrowserRouter, Routes, Route } from "react-router";

import Home from './pages/Home.jsx';

import LoginLayout from './pages/LoginLayout.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route index element={<Home />} />

      {/* Makes it so both "/login" and "/signup" routes use the LoginLayout component */}
      <Route element={<LoginLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
      </Route>
    </Routes>
  </BrowserRouter >
);