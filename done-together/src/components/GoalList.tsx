import React from 'react';
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import elmo from '../assets/elmo-profile-picture.jpg';
import EditPopUp from './EditPopUp';

interface Goal { 
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  ownerID: number;
  username: string; // owner's username
  goalID: number;
  users: User[]
}

// make a collaborator object
interface User {
  userID: number;
  username: string;
  completion: boolean;
}

interface GoalListProps {
  goals: Goal[];
  handleDelete: (goalID: number) => void;
}

const GoalList: React.FC<GoalListProps> = ({ goals, handleDelete }) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  
  const calculateDaysLeft = (endDate: string) => {
    const currentDate = new Date();
    const end = new Date(endDate);
    const timeDiff = end.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
    return daysLeft > 0 ? daysLeft : 0; // Ensure we don’t show negative days
  };
  
  return (
    <div>
      <div className="goal-list">
        {goals.map((goal) => (
          <div key={goal.goalID} className="goal-box">  
            <BsThreeDots
              onClick={() => setOpenMenuId(openMenuId === goal.goalID ? null : goal.goalID)}
              className="edit-menu"
            />

            {/* Dropdown Menu */}
            {openMenuId === goal.goalID && (
              <div className="menu-options">
                  <button onClick={() => setEditGoal(goal)}>Edit</button>
                <button onClick={() => handleDelete(goal.goalID)}>Delete</button>
              </div>
            )}

            <h2 className='goal-title'>{goal.title}</h2>

            <div className="users-container">
              {/* iterate through collaborators = [userIDs], hard code for now*/}
              
              <div className="collaborator-box">
                <img src={elmo} className="collaborator-image" alt="collaborator image" />
                <p>{goal.username}</p>
                <input
                    type="checkbox"
                    className="check-box"
                    checked={true}
                    onChange={() => {}}
                    // add a handler to change completion status if needed 
                    // how do I change a database based on this action?
                  />
              </div>

              {goal.users.map((user) => (
                <div className="collaborator-box" key={user.userID}>
                  <img src={elmo} className="collaborator-image" alt="collaborator image" />
                  <p>{user.username}</p>
                  <input
                    type="checkbox"
                    className="check-box"
                    checked={user.completion}
                    onChange={() => {}}
                    // You can add a handler to change completion status if needed
                  />
                </div>
              ))}

            </div>

            <div className= 'date-display'>
              <button className = 'date-button'>{calculateDaysLeft(goal.endDate)} Days Left</button>
            </div>

            <button className="add-user-button">+ Add User</button>
            
          </div>

        ))}
        
      </div>
        {/* Show Edit Goal Pop-Up when a goal is being edited */}
        {editGoal && (
        <EditPopUp goal={editGoal} setGoalPopUpState={() => setEditGoal(null)} />)}

    </div>
  );
};

export default GoalList;
