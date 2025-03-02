import React, { Component } from 'react'
const GoalList = ( props ) => {
    const goals = props.goals;
    
    return (  
        <div> 
            <h2>My Current Goals: </h2>
            <div className= 'goal-list'>
                {goals.map((goal) => (
                    <div className= 'goal-box' key={goal.id}>
                        <h2>{ goal.title} </h2>
                        <p>{ goal.goalID }</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
 
export default GoalList;