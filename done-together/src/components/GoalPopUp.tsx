import React from 'react';
import { useState } from 'react';


interface GoalPopUpProps {
  setGoalPopUpState: (state: boolean) => void;
}

const GoalPopUp: React.FC<GoalPopUpProps> = ({ setGoalPopUpState }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());

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

        <label className="start-date">Start Date:</label>
        <input
          className="start-date-input"
          type="date"
          required
          value={startDate.toISOString().split("T")[0]} // Converts Date to "YYYY-MM-DD"
          onChange={(e) => setStartDate(new Date(e.target.value + "T00:00:00"))} // Ensures correct Date parsing
        />

        {/* Debugging  */}
        <p>{startDate.toISOString().split("T")[0]}</p>

      </form>
    </div>
  );


};

export default GoalPopUp;