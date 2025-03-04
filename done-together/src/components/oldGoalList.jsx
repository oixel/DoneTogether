import React, { Component } from 'react'
import { GiHamburgerMenu } from "react-icons/gi";


const GoalList = ( { goals, handleDelete } ) => {
    return (  
        <div> 
            <div className= 'goal-list'>
                {goals.map((goal) => (
                    <div className= 'goal-box' key={goal.id}>
                        {/* for now the Menu will delete the goal, will do more menu options later */}
                        <GiHamburgerMenu onClick={() => handleDelete(goal.goalID)} className='hamburger-menu'/>
                        <h2>{ goal.title } </h2>
                        <p>{ goal.goalID }</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
 
export default GoalList;