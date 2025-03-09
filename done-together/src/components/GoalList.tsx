import React from 'react';
import { BsThreeDots } from "react-icons/bs";

interface Goal { 
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  userID: number;
  goalID: number;
}

interface GoalListProps {
  goals: Goal[];
  handleDelete: (goalID: number) => void;
}

const GoalList: React.FC<GoalListProps> = ({ goals, handleDelete }) => {
  return (
    <div>
      <div className="goal-list">
        {goals.map((goal) => (
          <div key={goal.goalID} className="goal-box">  
            {/* changed to goalID */}
            {/* for now the Menu will delete the goal, will do more menu options later */}
            <BsThreeDots onClick={() => handleDelete(goal.goalID)} className="edit-menu" />
            <h2 className='goal-title'>{goal.title}</h2>

            <div className= 'date-display'>
              {/*use a button to allow users to change the dates as needed*/}
              <button className = 'date-button'>{goal.startDate}</button>
              <p>-</p>
              <button className = 'date-button'>{goal.endDate}</button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalList;
