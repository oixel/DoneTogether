import React from 'react';
import '../styles/GoalList.css'; // Create this CSS file for styling
import { FaEdit, FaTrash, FaUserPlus, FaCalendarAlt } from 'react-icons/fa';

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
  onAddCollaborator: (goalID: number) => void;
  onEditDates: (goalID: number) => void;
  onEditGoal: (goalID: number) => void;
}

const GoalList: React.FC<GoalListProps> = ({ 
  goals, 
  handleDelete, 
  onAddCollaborator, 
  onEditDates,
  onEditGoal
}) => {
  const formatDate = (dateString: string): string => {
    // Check if date is in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-');
      return `${month}/${day}/${year}`;
    }
    
    return dateString;
  };

  // Calculate days left until end date
  const calculateDaysLeft = (endDate: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let targetDate: Date;
    
    // Check if date is in MM/DD/YYYY format
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(endDate)) {
      const [month, day, year] = endDate.split('/');
      targetDate = new Date(`${year}-${month}-${day}`);
    } else {
      // Assume YYYY-MM-DD format
      targetDate = new Date(endDate);
    }
    
    const timeDiff = targetDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  return (
    <div className="goal-list">
      {goals.map((goal) => {
        const daysLeft = calculateDaysLeft(goal.endDate);
        const isExpired = daysLeft < 0;
        
        return (
          <div key={goal.goalID} className={`goal-card ${isExpired ? 'expired' : ''}`}>
            <div className="goal-header">
              <h3 className="goal-title">{goal.title}</h3>
              <div className="goal-actions">
                <button 
                  onClick={() => onEditGoal(goal.goalID)} 
                  className="action-button edit-button" 
                  title="Edit Goal"
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => handleDelete(goal.goalID)} 
                  className="action-button delete-button" 
                  title="Delete Goal"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            
            <p className="goal-description">{goal.description}</p>
            
            <div className="goal-details">
              <div className="goal-dates">
                <p>
                  <strong>Start:</strong> {formatDate(goal.startDate)}
                </p>
                <p>
                  <strong>End:</strong> {formatDate(goal.endDate)}
                </p>
              </div>
              
              <div className="goal-status">
                {isExpired ? (
                  <span className="expired-label">Expired</span>
                ) : (
                  <span className="days-left">{daysLeft} days left</span>
                )}
              </div>
            </div>
            
            <div className="goal-footer">
              <button 
                onClick={() => onAddCollaborator(goal.goalID)} 
                className="secondary-button" 
                title="Add Collaborator"
              >
                <FaUserPlus /> Add Collaborator
              </button>
              <button 
                onClick={() => onEditDates(goal.goalID)} 
                className="secondary-button" 
                title="Edit Dates"
              >
                <FaCalendarAlt /> Edit Dates
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GoalList;