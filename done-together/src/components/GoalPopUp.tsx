import React from 'react';
import { useState } from 'react';


interface GoalPopUpProps {
  setGoalPopUpState: (state: boolean) => void;
}

const GoalPopUp: React.FC<GoalPopUpProps> = ({ setGoalPopUpState }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  return (
    <div className="pop-up">
      <button onClick={() => setGoalPopUpState(false)}>Exit</button>
      <div className="create-goal">Create Goal</div>
      <form className="goal-form">
        <label className="goal-name">Goal Name:</label>
        <input
          className="goal-name-input"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="goal-description">Goal Description:</label>
        <textarea
          className="goal-description-input"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* Debugging  */}
        {/* <p>{description}</p> */}

      </form>
    </div>
  );


};

export default GoalPopUp;