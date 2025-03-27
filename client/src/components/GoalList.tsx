import React from 'react';
import Goal from './Goal';

interface GoalListProps {
  goals: Goal[];
}


const GoalList: React.FC<GoalListProps> = ({ goals }) => {
  return (
    <div>
      <div className="goal-list">
        {goals.map((goal) => (
        <Goal goal={goal} />
       ))}
      </div>
    </div>
  );
};

export default GoalList;