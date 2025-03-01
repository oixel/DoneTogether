import React from 'react'
import "../globalStyles.css"
import { ReactComponent as BeigeLogo } from '../assets/icons/logo-beige.svg'
import { Link } from "react-router";

function AboutUs() {
    return (
        <div className="container">
              <div className="navbar">
                <BeigeLogo className='home-page-navbar-logo'/>
            </div>
        </div>
    );
}

export default AboutUs;