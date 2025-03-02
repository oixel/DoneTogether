import React from 'react'
import { useState } from 'react'
import "../globalStyles.css"
import "../userHomePage.css"
import elmo from '../assets/elmo-profile-picture.jpg'
import { ReactComponent as BeigeLogo } from '../assets/icons/logo-beige.svg'
import GoalList from '../components/goalList'

function UserHomePage() {
    /* set the state of whether or not the add goal tab is open */
    const [goalState, setGoalState] = useState(false);

    /* store the goals in a list format - get from MONGODB */
    const [goals, addGoal] = useState([
        {title: "Drink More Water.", description: "lorem ipsum...", date: '00/00/0000', userID: 12345, goalID: 1}, /* what else do we need */
        {title: "Drink More Water.", description: "lorem ipsum...", date: '00/00/0000', userID: 12345, goalID: 2},
        {title: "Drink More Water.", description: "lorem ipsum...", date: '00/00/0000', userID: 12345, goalID: 3},
        {title: "Drink More Water.", description: "lorem ipsum...", date: '00/00/0000', userID: 12345, goalID: 4},
        {title: "Drink More Water.", description: "lorem ipsum...", date: '00/00/0000', userID: 12345, goalID: 5},
        {title: "Drink More Water.", description: "lorem ipsum...", date: '00/00/0000', userID: 12345, goalID: 6},
    ]);
    
    const handleClick = () => {
        /* open up an add goal screen */
        console.log("Button has been clicked");
        setGoalState(!goalState);
    }

    return (
        <div className="container">
            <div className="navbar">
                <BeigeLogo className='home-page-navbar-logo'/>
                <div className='user-profile-frame'><img src={elmo} className="profile-image"/> </div>
            </div>
            <button onClick = {handleClick} className='create-goal-button'>+ Add Goal {goalState ? 1 : 0}</button>

            <GoalList goals={goals}/>
        </div>
    );
}


export default UserHomePage;