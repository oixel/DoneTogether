import React from 'react';
import { useState } from 'react';


interface GoalPopUpProps {
  setGoalPopUpState: (state: boolean) => void;
}

const GoalPopUp: React.FC<GoalPopUpProps> = ({ setGoalPopUpState }) => {
  const [title, setTitle] = useState<string>('');

  return (
    <div className="pop-up">
      <button onClick={() => setGoalPopUpState(false)}>Exit</button>
      <h2 className="create-goal">Create Goal</h2>
      <form>
        <label>Goal Name</label>
        <input
        type = "text"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        />
       <p>{title}</p>
      </form>
    </div>
    
  );
};

export default GoalPopUp;