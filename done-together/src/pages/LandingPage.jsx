import React from 'react'
import { Link } from "react-router"; // If you're using `react-router-dom`, this should be `import { Link } from "react-router-dom";`
import homeArrow from '../assets/icons/arrowHomePage.svg';
import leftPetal from '../assets/icons/leftPetalsDoodle.svg';
import rightPetal from '../assets/icons/rightPetalsDoodle.svg';
import leftBranch from '../assets/icons/branchLeavesDoodleLeft.svg';
import rightBranch from '../assets/icons/branchLeavesDoodleRight.svg';
import crossHatch from '../assets/icons/crossHatchDoodle.svg';
import twoUnderline from '../assets/icons/twoUnderlineDoodle.svg';
import circle from '../assets/icons/circleDoodle.svg';
import threeArrow from '../assets/icons/threeArrow.svg';
import swirl from '../assets/icons/swirlDoodle.svg';
import target from '../assets/icons/targetDoodle.svg';
import threeSmiles from '../assets/icons/threeSmiles.svg';
import trophy from '../assets/icons/trophyDoodle.svg';
import spark from '../assets/icons/spark.svg';
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
            <img src={leftBranch} alt="Branch Left" className="left-branch"/>
            <img src={rightBranch} alt="Branch Right" className="right-branch"/>
            <img src={twoUnderline} alt="Two Underline" className="two-underline"/>
            <img src={circle} alt="Circle" className="circle"/>
           
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
            <img src={crossHatch} alt="Cross Hatch" className="cross-hatch"/>
            <img src={threeArrow} alt="Three Arrow" className="three-arrow"/>
            <img src={swirl} alt="Swirl" className="swirl"/>
            <img src={target} alt="Target" className="target"/>
            <img src={threeSmiles} alt="Three Smiles" className="three-smiles"/>
            <img src={trophy} alt="Trophy" className="trophy"/>
            <img src={spark} alt="Spark" className="spark-one"/>
            <img src={spark} alt="Spark" className="spark-two"/>
            <img src={spark} alt="Spark" className="spark-three"/>
            <img src={spark} alt="Spark" className="spark-four"/>
            <div className="compete">Compete.</div>
            <div className="collaborate">Collaborate.</div>
            <div className="section-text goals-text">Set a clear goal with a description, start date, and end date to stay on track. Keep it direct and focused to be successful.</div>
            <div className="section-text collaborate-text">Add a friend to your goal to work on it together. Share tasks and support each other to stay on track.</div>
            <div className="section-text compete-text">Build the longest streak by consistently achieving your goals. Compete with friends to see who can maintain the highest streak.</div>
          </div>

          {/* <div className='footer'></div> */}
        </div>
    );
}

export default LandingPage;
