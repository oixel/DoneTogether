// each individual Goal Box should be its own component
import { useState, useEffect, useCallback } from 'react';
import { BsThreeDots } from 'react-icons/bs';

import EditPopUp from './EditPopUp';
import AddUserComponent from './AddUser';
import User from './User';

import "../styles/popUp.css";

import { getUserById } from '../api/userRequests.ts';

// Import custom interfaces from respective scripts
import { GoalData } from '../types/goalData';
import { UserData } from '../types/userData';

// Define the schema for goals with updated users type
interface GoalPropTypes {
  goal: GoalData;
  currentUserId: string;
}

const Goal = ({ goal, currentUserId }: GoalPropTypes) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // three dots menu 
  const [editGoal, setEditGoal] = useState<GoalData | null>(null); // edit goal popup (actual goal information)
  const [editGoalPopUpState, setEditGoalState] = useState<boolean>(false); // edit goal popup

  const [users, setUsers] = useState<UserData[]>([]);

  const handleMenuClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleEditMenuClick = (goal: GoalData) => {
    setIsMenuOpen(false);
    setEditGoalState(true);
    setEditGoal(goal);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    // implement deletion here
  }

  const calculateDaysLeft = (endDate: Date) => {
    if (endDate) {
      const currentDate = new Date();
      const timeDiff = endDate.getTime() - currentDate.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
      return daysLeft > 0 ? daysLeft : 0; // Ensure we don’t show negative days
    }
    else {
      return "No End Date";
    }
  };

  // Loops through all user objects and grabs their profile information from Clerk database and combines it with their respective statuses from MongoDB
  // Using Callback to prevent unnecessarry re-renders from the useEffect call
  const getUsers = useCallback(async () => {
    // Initialize empty array to append all user data for this goal into
    const newUsers: Array<UserData> = [];

    // Check if users exists and is in array
    if (goal.users && Array.isArray(goal.users)) {
      for (const userData of goal.users) {
        if (userData !== null) {
          // Handle user object format
          const userId = userData.userId;

          // Initialize newUser to have all of the user's data from Clerk database
          const newUser = await getUserById(userId);

          // Only continue if newUser is not null
          if (newUser) {
            // Append the user's statuses for this goal to the user's object
            newUser.joined = userData.joined;
            newUser.completed = userData.completed;

            // 
            newUsers.push(newUser);
          }
        }
      }
    }

    setUsers(newUsers);
  }, [goal.users]);

  // Update the user data whenever there is a change in this goal's user's array in MongoDB
  useEffect(() => {
    getUsers();
  }, [goal.users, getUsers]);

  return (
    <div>
      <div className="goal-box">
        <BsThreeDots className="edit-menu" onClick={handleMenuClick} />
        {isMenuOpen && (
          <div className="menu-options">
            <button onClick={() => handleEditMenuClick(goal)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}

        <h2 className='goal-title'>{goal.name}</h2>
        <div className="users-container">
          {users.map((user) => (
            <User
              key={user.userId}
              goalId={goal._id}
              userData={user}
              isReadOnly={user.userId != currentUserId}  // Prevents user from updating other users' completion status
            />
          ))}
        </div>

        <div className='date-display'>
          <button className='date-button'>{/*calculateDaysLeft(goal.endDate)*/ "FIX DATE STUFF"} Days Left</button>
        </div>

        <AddUserComponent />

      </div>

      {/* render the edit popup if the state is opened */}
      {editGoalPopUpState && <div className="overlay active"></div>}
      {editGoalPopUpState && editGoal && (<EditPopUp goal={editGoal} setEditGoalState={setEditGoalState} />)}


    </div>
  );
};

export default Goal;

