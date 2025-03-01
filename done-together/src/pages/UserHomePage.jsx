import React from 'react'
import "../globalStyles.css"
import "../userHomePage.css"
import elmo from '../assets/elmo-profile-picture.jpg'
import { ReactComponent as BeigeLogo } from '../assets/icons/logo-beige.svg'

function UserHomePage() {
    return (
        <div className="container">
              <div className="navbar">
                <BeigeLogo className='home-page-navbar-logo'/>
                <div className='user-profile-frame'><img src={elmo} className="profile-image"/> </div>
            </div>
            <button className='create-goal-button'>+ Add Goal</button>
        </div>
    );
}


export default UserHomePage;