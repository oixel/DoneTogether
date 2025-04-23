import { JSX, useState } from 'react';
import "../styles/addUser.css";
import { FaRegCheckCircle } from "react-icons/fa";
import "../api/goalRequests.ts"; // Assuming you have a file for API requests
import { getUserByName } from '../api/userRequests';
import { updateUsersList } from '../api/goalRequests.ts';

function AddUserComponent({ goalId, setNeedRefresh }: { goalId: string, setNeedRefresh: CallableFunction }): JSX.Element {
  // Local state => should that cause any issues?
  const [addUserPopUpState, setAddUserPopUpState] = useState(false);
  const [username, setUsername] = useState("");

  const handleAddUserClick = async () => {
    // Toggle the state to open/close the popup
    setAddUserPopUpState(!addUserPopUpState);
    if (addUserPopUpState && username) {
      // If the popup is closing, reset the username
      const user = await checkExistence();

      const newUser = {
        userId: user?.userId,
        joined: false,
        completed: false
      }

      await updateUsersList(goalId, newUser, 'add');
      setNeedRefresh(true);

      setUsername("");
    }
  };

  const checkExistence = async () => {
    const user = await getUserByName(username);

    if (user != null) {
      return user;
    } else {
      return null;
    }
  }

  const handleUserNameChange = (e) => {
    setUsername(e.target.value);
  }

  return (
    <div>
      {/* Button shows up if popup state is false */}
      {!addUserPopUpState ? (
        <button className="add-user-button" onClick={handleAddUserClick}>+ Add User</button>
      ) : (
        // If state = true
        <div className="add-user-input">
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={handleUserNameChange}
          />
          <FaRegCheckCircle className='confirm-button' onClick={handleAddUserClick}>Close</FaRegCheckCircle> {/* Close and return back to add user button */}
        </div>
      )}
    </div>
  );
};

export default AddUserComponent;
