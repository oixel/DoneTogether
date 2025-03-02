import React from 'react'
import { Link } from "react-router"; // If you're using `react-router-dom`, this should be `import { Link } from "react-router-dom";`
import homeArrow from '../assets/icons/arrowHomePage.svg';
import leftPetal from '../assets/icons/leftPetalsDoodle.svg';
import rightPetal from '../assets/icons/rightPetalsDoodle.svg';
import { ReactComponent as BeigeLogo } from '../assets/icons/logo-beige.svg'
import { ReactComponent as GreenLogo} from '../assets/icons/logo-dark-green.svg'

import "../landingPage.css"
import "../globalStyles.css"

function LandingPage(){
    return (
        <div>
          <div className="welcome-container">
            <h1 className="done-together">DoneTogether</h1>
            <img src={homeArrow} alt="Home Arrow" className="home-page-arrow"/>
            <img src={leftPetal} alt="Flower Petal" className="left-petal"/>
            <img src={rightPetal} alt="Flower Petal" className="right-petal"/>
            <Link to= '/login' className="get-started-button">Get Started ➪</Link>

            <div className="navbar">
              <BeigeLogo className='home-page-navbar-logo'/>
              <Link to="/aboutUs" className="nav-button">About Us</Link>
              <Link to="/login" className="nav-button">Log In</Link> 
            </div>

            <GreenLogo className='home-page-logo'/>
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

          {/* <div className='footer'></div> */}
        </div>
    );
}

export default LandingPage;
