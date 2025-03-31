import React from 'react';
import { Link } from 'react-router-dom';

import beigeLogo from "../assets/icons/logo-beige.svg";

import "../styles/globalStyles.css";
import "../styles/AboutUs.css";

const AboutUs: React.FC = () => {
    return (
        <div className="container">
            <div className="navbar">
                <img src={beigeLogo} alt="Beige Logo" className='home-page-navbar-logo' />
                <Link to="/" className="nav-button">Home</Link>
            </div>

            <div className="about-us-content">
                <h1>About DoneTogether</h1>

                <section className="about-section">
                    <h2>Our Mission</h2>
                    <p>
                        At DoneTogether, we believe that success is better when shared. Our mission is to
                        help people achieve their goals by leveraging the power of collaboration and friendly competition.
                    </p>
                </section>

                <section className="about-section">
                    <h2>How It Works</h2>
                    <p>
                        DoneTogether makes it easy to set goals, track progress, and stay motivated through:
                    </p>
                    <ul>
                        <li>Clear goal-setting with specific timelines</li>
                        <li>Optional collaboration with friends</li>
                        <li>Streak tracking to build consistent habits</li>
                        <li>Friendly competition to boost motivation</li>
                    </ul>
                </section>

                <section className="about-section">
                    <h2>Our Story</h2>
                    <p>
                        DoneTogether was founded on the principle that accountability and support are
                        key ingredients to achieving any goal. Whether you're building a new habit,
                        working on a project, or pursuing a dream, having someone alongside you makes
                        the journey more enjoyable and increases your chances of success.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;