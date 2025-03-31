// each individual Goal Box should be its own component
import { useState, useEffect, useCallback } from 'react';
import { BsThreeDots } from 'react-icons/bs';

import EditPopUp from './EditPopUp';
import AddUserComponent from './AddUser';
import User from './User';

import "../styles/popUp.css";

import { getUserById } from '../api/userRequests.ts';
import { updateUsersList, deleteGoal } from '../api/goalRequests.ts';

// Import custom interfaces from respective scripts
import { GoalData } from '../types/goalData';
import { UserData } from '../types/userData';

// Define the schema for goals with updated users type
interface GoalPropTypes {
  goal: GoalData;
  currentUserId: string;
  setNeedRefresh: CallableFunction;
}

const Goal = ({ goal, currentUserId, setNeedRefresh }: GoalPropTypes) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // three dots menu 
  const [editGoal, setEditGoal] = useState<GoalData | null>(null); // edit goal popup (actual goal information)
  const [editGoalPopUpState, setEditGoalState] = useState<boolean>(false); // edit goal popup

  const [users, setUsers] = useState<UserData[]>([]);

  const handleMenuClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // 
  const handleEditMenuClick = (goal: GoalData) => {
    setIsMenuOpen(false);
    setEditGoalState(true);
    setEditGoal(goal);
  };

  // Handles deleting / leaving goals
  async function handleDelete() {
    if (currentUserId == goal.ownerId) {
      // (Delete goal) Send axios request to DELETE this goal
      await deleteGoal(goal._id);
    }
    else {
      // (Leave goal) Send axios request to remove this user from goal's users array
      await updateUsersList(goal._id, { userId: currentUserId }, 'remove');
    }

    // Triggers refresh of goals
    setNeedRefresh(true);

    // Close settings menu
    setIsMenuOpen(false);
  }

  // Takes the start and end date and determines how many days are left for this goal.
  function calculateDaysLeft() {
    if (goal.endDate && goal.endDate >= goal.startDate) {
      // Get the time difference between the goal's end date and today
      const timeDiff = new Date(goal.endDate).getTime() - new Date().getTime();

      let daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
      daysLeft = (daysLeft > 0) ? daysLeft : 0; // Ensure we don’t show negative days

      // Return number of days left
      return `${daysLeft} Days Left`;
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

    // Update the users list to reflect the new users
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
            <button onClick={handleDelete}>{(currentUserId == goal.ownerId) ? "Delete" : "Leave"}</button>
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
          <button className='date-button'>{calculateDaysLeft()}</button>
        </div>

        <AddUserComponent />
      </div>

      {/* Render the edit PopUp if the state is opened */}
      {editGoalPopUpState && <div className="overlay active"></div>}
      {editGoalPopUpState && editGoal && (
        <EditPopUp
          goal={editGoal}
          setEditGoalState={setEditGoalState}
          setNeedRefresh={setNeedRefresh}
        />
      )}
    </div>
  );
};

export default Goal;

