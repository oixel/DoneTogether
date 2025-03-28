// each individual Goal Box should be its own component
import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import elmo from '../assets/elmo-profile-picture.jpg';
import "../styles/popUp.css";
import EditPopUp from './EditPopUp';
import AddUserPopUp from './AddUserPopUp';

interface Goal {  
    name: string;
    description: string;
    ownerID: string; 
    users: goalUser[];
    
    startDate: string;
    endDate: string;
}
  
interface goalUser {
    userID: string;
    joined: boolean;
    completion: boolean;
}

interface GoalProps {
    goal: Goal;
}

const Goal: React.FC<GoalProps> = ({ goal }) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // three dots menu 
    const [editGoal, setEditGoal] = useState<Goal | null>(null); // edit goal popup (actual goal information)
    const [editGoalPopUpState, setEditGoalState] = useState<boolean>(false); // edit goal popup
    const [addUserPopUpState, setAddUserState] = useState<boolean>(false); // add collaborator popup
    
    const handleMenuClick = () => {
        setIsMenuOpen((prev) => !prev);
      };
     
    const handleEditMenuClick = (goal: Goal) => {
        setIsMenuOpen(false);
        setEditGoalState(true);
        setEditGoal(goal);
    };

    const handleDelete = () => {
        setIsMenuOpen(false);
        // implement deletion here
    }

    const handleAddUserClick = () => {
      setAddUserState((prev) => !prev);
    }

    const calculateDaysLeft = (endDate: string) => {
        const currentDate = new Date();
        const end = new Date(endDate);
        const timeDiff = end.getTime() - currentDate.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
        return daysLeft > 0 ? daysLeft : 0; // Ensure we don’t show negative days
      };

    return (
    <div>
      <div className="goal-box">
        <BsThreeDots className="edit-menu" onClick={handleMenuClick}/>
        {isMenuOpen && (
              <div className="menu-options">
                <button onClick={() => handleEditMenuClick(goal)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
              </div>
        )}

        <h2 className='goal-title'>{goal.name}</h2>
        <div className="users-container">
              {goal.users.map((user) => (
                <div className="collaborator-box" key={user.userID}>
                  <img src={elmo} className="collaborator-image" alt="collaborator image" />
                  <p>{user.userID}</p>
                  <input
                    type="checkbox"
                    className="check-box"
                    checked={user.completion}
                    onChange={() => {}}
                    // Add a handler to change completion status
                  />
                </div>
                ))}
            </div>

            <div className= 'date-display'>
              <button className = 'date-button'>{calculateDaysLeft(goal.endDate)} Days Left</button>
            </div>

            <button className="add-user-button" onClick={handleAddUserClick}>+ Add User</button>
            {/* render the add user popup if the state is opened */}
            {addUserPopUpState && (
                   <AddUserPopUp 
                   addUserPopUpState={addUserPopUpState} 
                    setAddUserState={setAddUserState} 
                  />
            )}

        </div> 

        {/* render the edit popup if the state is opened */}
        {editGoalPopUpState && <div className="overlay active"></div>}
        {editGoalPopUpState && editGoal && (<EditPopUp goal={editGoal} setEditGoalState={setEditGoalState} />)}


    </div>
    );
  };

export default Goal;

