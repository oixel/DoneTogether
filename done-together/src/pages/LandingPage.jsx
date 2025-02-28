import React from 'react'
import { Link } from "react-router";

import Navbar from '../components/Navbar';
import "../landingPage.css"

function LandingPage(){
    return (
        <div className="container">
          <div className="done-together">DoneTogether</div>
          <div className="goals">Goals.</div>
          <div className="compete">Compete.</div>
          <div className="collaborate">Collaborate.</div>
          <div className="about-us">About Us</div>
          <div className="logo">Logo</div>
          <div className="button">Get Started ➪</div>
          <div className="nav-button nav-about-us">About Us</div>
          <div className="nav-button nav-log-in">Log In</div>
          <div className="nav-button nav-sign-up">Sign Up</div>
          <div className="success-text">Success is better together.</div>
          <div className="section-text section-text-1">Ort nur endigend erzahlte spielend hausherr ihr schmales tadellos. Wu preisen so pa argerte gefallt wahrend schonen. Neu</div>
          <div className="section-text section-text-2">Ort nur endigend erzahlte spielend hausherr ihr schmales tadellos. Wu preisen so pa argerte gefallt wahrend schonen. Neu</div>
          <div className="section-text section-text-3">Ort nur endigend erzahlte spielend hausherr ihr schmales tadellos. Wu preisen so pa argerte gefallt wahrend schonen. Neu</div>
        </div>
      );
      
}



export default LandingPage;
