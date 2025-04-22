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
                <h1><strong>~ About DoneTogether ~</strong></h1>

                <section className="about-section">
                    <h2><strong>Our Mission</strong></h2>
                    <p>
                        At DoneTogether, we believe that success is better when shared. Our mission is to
                        help people achieve their goals by leveraging the power of collaboration and friendly competition.

                        We hope that our tool aids in whatever endevors, habits, or goals you pursue!
                    </p>
                </section>

                <section className="about-section">
                    <h2><strong>How It Works</strong></h2>
                    <p>
                        DoneTogether is a web application that makes it easy to set goals, track progress, and stay motivated through:
                    </p>
                    <ul>
                        <li>★ Flexible and adaptible goal creation</li>
                        <li>★ Stress-free collaboration</li>
                        <li>★ Streak tracking to aid with developing habits</li>
                        <li>★ Friendly competition to boost motivation and morale</li>
                    </ul>
                </section>

                <section className="about-section">
                    <h2><strong>Our Story</strong></h2>
                    <p>
                        DoneTogether was developed as part of the CEN3031 - Introduction to Software Engineering
                        class at the University of Florida. We were prompted to develop a piece of software that
                        can serve as a tool for education. Due to our shared stresses of maintaining productivity
                        and desires to form healthy study habits, we came up with the idea of <strong>DoneTogether</strong>
                        as a solution to our struggles with wavering motivation. We realized that although goals are initially
                        really exciting to pursue, eventually the spark dwindles with time. For that, we sought to develop a
                        tool that would form a collaborative and competitive atmosphere for motivation for whatever goals one may desire.
                        <br /> <br />
                        The final result was <strong>DoneTogether</strong>!
                    </p>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;