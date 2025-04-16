import { Link } from "react-router-dom";
import { SignedOut, SignInButton, SignUpButton, SignedIn, SignOutButton } from '@clerk/clerk-react';
/* npm install framer */
import { motion } from 'framer-motion';

import homeArrow from "../assets/icons/arrowHomePage.svg";
import leftPetal from "../assets/icons/leftPetalsDoodle.svg";
import rightPetal from "../assets/icons/rightPetalsDoodle.svg";
import leftBranch from "../assets/icons/branchLeavesDoodleLeft.svg";
import rightBranch from "../assets/icons/branchLeavesDoodleRight.svg";
import crossHatch from "../assets/icons/crossHatchDoodle.svg";
import twoUnderline from "../assets/icons/twoUnderlineDoodle.svg";
import circle from "../assets/icons/circleDoodle.svg";
import threeArrow from "../assets/icons/threeArrow.svg";
import swirl from "../assets/icons/swirlDoodle.svg";
import target from "../assets/icons/targetDoodle.svg";
import threeSmiles from "../assets/icons/threeSmiles.svg";
import trophy from "../assets/icons/trophyDoodle.svg";
import spark from "../assets/icons/spark.svg";

// Import SVGs as URLs instead of using ReactComponent
import beigeLogo from "../assets/icons/logo-beige.svg";
import greenLogo from "../assets/icons/logo-dark-green.svg";

import "../styles/LandingPage.css";
import "../styles/globalStyles.css";


const LandingPage: React.FC = () => {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } },
  };

  const FadeInSection = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.5 }}
    >
      {children}
    </motion.div>
  );

  
const Jiggle = ({ src, className}: { src: string; className?: string; animate?: object }) => (
  <motion.img
    src={src} // Now src is dynamic!
    alt="Flower Petal"
    className={className}
    animate={{ rotate: [0, 2, -2, 0] }}
    transition={{
      repeat: Infinity,
      repeatType: "mirror",
      duration: 2,
      ease: "easeInOut",
    }}
    style={{ transformOrigin: "bottom center" }}
  />
);

  

  return (
    <div>
      <div className="welcome-container">
        <h1 className="done-together">DoneTogether</h1>
        <img src={homeArrow} alt="Home Arrow" className="home-page-arrow" />

        <Jiggle src={leftPetal} className="left-petal" />
        <img src={leftPetal} alt="Flower Petal" className="left-petal" />

        <Jiggle src={rightPetal} className="right-petal" animate={{ rotate: [-3, 0, 0, -3] }} />
        <img src={rightPetal} alt="Flower Petal" className="right-petal" />

        <Jiggle src={leftBranch} className="left-branch" />
        <Jiggle src={rightBranch} className="right-branch" animate={{ rotate: [-3, 0, 0, -3] }} />
       
        <img src={twoUnderline} alt="Two Underline" className="two-underline" />
        <img src={circle} alt="Circle" className="circle" />
        <SignedOut>
          <SignUpButton mode="modal">
            <button className="get-started-button">Get Started ➪</button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <Link to="/dashboard" className="get-started-button">Dashboard</Link>
        </SignedIn>


        <div className="navbar">
          {/* Replace ReactComponent with regular img tag */}
          <img src={beigeLogo} alt="Beige Logo" className='navbar-logo' />

          <Link to="/aboutUs" className="nav-button">About Us</Link>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="nav-button">Sign In</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link to="/dashboard" className="nav-button">Dashboard</Link>
            <SignOutButton>
              <button className="nav-button">Sign Out</button>
            </SignOutButton>
          </SignedIn>

        </div>

        {/* Replace ReactComponent with regular img tag */}
        <img src={greenLogo} alt="Green Logo" className='home-page-logo' />
        <div className="success-text">Success is better together.</div>
      </div>
      <div className="blurbs-container">
       
        <img src={crossHatch} alt="Cross Hatch" className="cross-hatch" />
        <img src={threeArrow} alt="Three Arrow" className="three-arrow" />
        <img src={swirl} alt="Swirl" className="swirl" />
        <img src={target} alt="Target" className="target" />
        <img src={threeSmiles} alt="Three Smiles" className="three-smiles" />
        <img src={trophy} alt="Trophy" className="trophy" />
        <img src={spark} alt="Spark" className="spark-one" />
        <img src={spark} alt="Spark" className="spark-two" />
        <img src={spark} alt="Spark" className="spark-three" />
        <img src={spark} alt="Spark" className="spark-four" />

        <div className="goals">
          <FadeInSection>
          Goals.
          </FadeInSection>
        </div>

        <div className="compete">
          <FadeInSection>
          Compete.
          </FadeInSection>
        </div>
          

         {/* Animated Collaborate Section */}
         <div className="collaborate">
            <FadeInSection>
              Collaborate.
            </FadeInSection>
          </div>

        <div className="section-text goals-text">
          {/* <FadeInSection> */}
            Set a clear goal with a description, start date, and end date to stay on track. Keep it direct and focused to be successful.
          {/* </FadeInSection> */}
        </div>

        <div className="section-text collaborate-text">Add a friend to your goal to work on it together. Share tasks and support each other to stay on track.</div>
        <div className="section-text compete-text">Build the longest streak by consistently achieving your goals. Compete with friends to see who can maintain the highest streak.</div>
      </div>
      {/* <div className='footer'></div> */}
    </div>
  );
};

export default LandingPage;