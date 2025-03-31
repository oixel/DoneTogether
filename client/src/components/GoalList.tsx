import Goal from './Goal';

import "../styles/GoalList.css";

// Import interface for GoalData object
import { GoalData } from '../types/goalData';

// 
interface GoalListPropTypes {
  goals: GoalData[];
  currentUserId: string;
  setNeedRefresh: CallableFunction;
  isLoading: boolean;
  error: string | null;
}

const GoalList = ({ goals, currentUserId, setNeedRefresh, isLoading, error }: GoalListPropTypes) => {
  // Show loading state
  if (isLoading && !goals.length) {
    return <div className="loading">Loading goals...</div>;
  }

  // Show error state
  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => setNeedRefresh(true)}>Try Again</button>
      </div>
    );
  }

  return (
    <div>
      <div className="goal-list">
        {goals.map((goal) => (
          <Goal
            key={goal._id}
            goal={goal}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
};

export default GoalList;