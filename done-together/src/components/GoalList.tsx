import React from 'react';
import { GiHamburgerMenu } from "react-icons/gi";

interface Goal {
  goalID: number;
  title: string;
//   id: number;
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
            <GiHamburgerMenu onClick={() => handleDelete(goal.goalID)} className="hamburger-menu" />
            <h2>{goal.title}</h2>
            <p>{goal.goalID}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalList;
