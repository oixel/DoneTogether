import React from 'react'
import { Link } from "react-router"; // If you're using `react-router-dom`, this should be `import { Link } from "react-router-dom";`

import Navbar from '../components/Navbar';
import homeArrow from '../assets/icons/arrowHomePage.svg';
import leftPetal from '../assets/icons/leftPetalsDoodle.svg';

import "../landingPage.css"

function LandingPage(){
    return (
        <div>
          <div className="welcome-container">
            <h1 className="done-together">DoneTogether</h1>
            <img src={homeArrow} alt="Home Arrow" className="home-page-arrow"/>
            <img src={leftPetal} alt="Flower Petal" className="left-petal"/>
            <div className="logo">Logo</div>
            <div className="button">Get Started ➪</div>
            <div className="navbar">
              <div className="nav-button nav-about-us">About Us</div>
              <div className="nav-button nav-log-in">Log In</div>
              <div className="nav-button nav-sign-up">Sign Up</div>
            </div>
            <div className="success-text">Success is better together.</div>
          </div>

          <div className="blurbs-container">
            <div className="goals">Goals.</div>
            <div className="compete">Compete.</div>
            <div className="collaborate">Collaborate.</div>
            <div className="section-text goals-text">Ort nur endigend erzahlte spielend hausherr ihr schmales tadellos. Wu preisen so pa argerte gefallt wahrend schonen. Neu</div>
            <div className="section-text collaborate-text">Ort nur endigend erzahlte spielend hausherr ihr schmales tadellos. Wu preisen so pa argerte gefallt wahrend schonen. Neu</div>
            <div className="section-text compete-text">Ort nur endigend erzahlte spielend hausherr ihr schmales tadellos. Wu preisen so pa argerte gefallt wahrend schonen. Neu</div>
          </div>

          <div className='footer-container'></div>
        </div>
    );
}

export default LandingPage;
