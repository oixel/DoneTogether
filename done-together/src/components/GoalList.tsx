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
  //completed: boolean; -> need to discuss where owner's completion will be
  collaborators: Collaborator[]
}

// make a collaborator object
interface Collaborator {
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
                    // You can add a handler to change completion status if needed
                  />
              </div>

              {goal.collaborators.map((collaborator) => (
                <div className="collaborator-box" key={collaborator.userID}>
                  <img src={elmo} className="collaborator-image" alt="collaborator image" />
                  <p>{collaborator.username}</p>
                  <input
                    type="checkbox"
                    className="check-box"
                    checked={collaborator.completion}
                    onChange={() => {}}
                    // You can add a handler to change completion status if needed
                  />
                </div>
              ))}

            </div>

            <div className= 'date-display'>
              {/*use a button to allow users to change the dates as needed*/}
              {/* <button className = 'date-button'>{goal.startDate}</button>
              <p>-</p> */}
              <button className = 'date-button'>{goal.endDate}</button>
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
