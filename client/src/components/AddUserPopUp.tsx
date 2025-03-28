import React, { useState } from 'react';
import "../styles/addUserPopUp.css";

interface AddUserPopUpProps {
    addUserPopUpState: boolean;
    setAddUserState: React.Dispatch<React.SetStateAction<boolean>>;  // Function type to update state
  }

const AddUserPopUp: React.FC<AddUserPopUpProps> = ({ addUserPopUpState, setAddUserState }) => {
    const handleClick = (): void => {
        setAddUserState(!addUserPopUpState);
      };


  return (
    <div className="add-user-container">
       <input
          type="text"
          placeholder="Enter your username"
        />
        <button type="submit" onClick={handleClick}>Submit</button>
    </div>
  );
};

export default AddUserPopUp;
