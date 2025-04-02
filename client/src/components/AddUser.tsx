import  { useState } from 'react';
import "../styles/addUser.css";
import { FaRegCheckCircle } from "react-icons/fa";
// import { updateUsersList } from '../api/goalRequests.ts'; 
const AddUserComponent = () => {
  // Local state => should that cause any issues?
  const [addUserPopUpState, setAddUserPopUpState] = useState(false);
  const [username, setUsername] = useState("");

  const handleAddUserClick = () => {
    // Toggle the state to open/close the popup
    setAddUserPopUpState(!addUserPopUpState);
    if (addUserPopUpState && username) {
      // If the popup is closing, reset the username
      console.log("Username added:", username);
      setUsername("");
    }
  };

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
