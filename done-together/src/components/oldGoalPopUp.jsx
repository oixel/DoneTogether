import React from 'react'

const GoalPopUp = ( {setGoalPopUpState }) => {
  
    return (
    <div className='pop-up'>
        <button onClick={() => setGoalPopUpState(false)}>Exit</button>
    </div>
  );
}

export default GoalPopUp;
