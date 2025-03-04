import React from 'react'
import { useState, useEffect } from 'react'
import "../globalStyles.css"
import "../userHomePage.css"
import elmo from '../assets/elmo-profile-picture.jpg'
import { ReactComponent as BeigeLogo } from '../assets/icons/logo-beige.svg'
import GoalList from '../../components/GoalList'
import GoalPopUp from '../../components/GoalPopUp'

function UserHomePage() {
    /* set the state of whether or not the add goal tab is open */
    const [goalPopUpState, setGoalPopUpState] = useState(false);

    /* store the goals in a list format for now - get from MONGO-DB? - JSON? */
    const [goals, setGoals] = useState([
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
        setGoalPopUpState(!goalPopUpState);
    }

    const handleDelete = (goalID) =>{
        /* Does not alter the initial data, but simply filter... not sure abt this */
        const newGoals = goals.filter(goal => goal.goalID !== goalID);
        setGoals(newGoals);
    }

    useEffect(() =>{
        /* fetch data, authetication service, etc stuff here in use effect hooks */
        /* runs for every re-render and dependencies as in [] below*/
        console.log("Use Effect Ran!")
    }, []);

    return (
        <div className="container">
            <div className="navbar">
                <BeigeLogo className='home-page-navbar-logo'/>
                <div className='user-profile-frame'><img src={elmo} className="profile-image"/> </div>
            </div>
            <button onClick = {handleClick} className='create-goal-button'>+ Add Goal {goalPopUpState ? 1 : 0}</button>
            
            {goalPopUpState && <div className="overlay active"></div>}
            {
                goalPopUpState &&
                <div>
                    {/* make add goal popup */}
                    <GoalPopUp setGoalPopUpState = {setGoalPopUpState}/>
                </div>
            }
            <GoalList goals={goals} handleDelete={handleDelete}/>
        </div>
    );
}


export default UserHomePage;