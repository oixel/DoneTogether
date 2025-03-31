import React from 'react';
import { useState } from 'react';
import { CgClose } from "react-icons/cg";

import { createGoal } from '../api/goalRequests';

import swirlyDoodle from "../assets/icons/swirlydoodle.svg";
import threeArrows from "../assets/icons/threearrowsPopUp.svg";

import "../styles/popUp.css";

interface GoalPopUpPropTypes {
  setGoalPopUpState: CallableFunction;
  setNeedRefresh: CallableFunction;
  ownerId: string;
}

function GoalPopUp({ ownerId, setGoalPopUpState, setNeedRefresh }: GoalPopUpPropTypes) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // const [startDate, setStartDate] = useState<Date>(new Date());
  // const [endDate, setEndDate] = useState<Date>(new Date());
  // const today = new Date();

  // const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  // Convert input into a type of date
  // const selectedDate = new Date(e.target.value);

  // setStartDate(selectedDate);
  // // Display error if selected start date is not valid
  // if (selectedDate < today) {
  //   alert("Start date cannot be in the past.");
  // } else if (endDate && selectedDate > endDate) {
  //   alert("Start date cannot be after the end date.")
  // } else {
  //   setStartDate(selectedDate);
  // }
  // };

  // const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // Convert input into a type of date
  //   const selectedDate = new Date(e.target.value);

  //   // Display error if selected end date is not valid
  //   if (selectedDate < today) {
  //     alert("End date cannot be in the past.");
  //   } else if (selectedDate < startDate) {
  //     alert("End date cannot be before the start date.")
  //   } else {
  //     setEndDate(selectedDate);
  //   }
  // };

  // Function to create a new goal
  async function handleGoalCreation(): Promise<void> {
    if (!ownerId) return;

    try {
      // Send an axios request with the goal's data and the user's id (to add the owner to the goal!)
      await createGoal(title, description, ownerId, /*startDate, endDate*/);

      // Refresh goals list
      setNeedRefresh(true);
    } catch (err) {
      console.error("Error creating goal:", err);
    }
  }

  // 
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a goal name");
      return;
    }

    if (!description.trim()) {
      alert("Please enter a description");
      return;
    }

    // if (!startDate) {
    //   alert("Please select a start date");
    //   return;
    // }

    // if (!endDate) {
    //   alert("Please select an end date");
    //   return;
    // }

    // 
    await handleGoalCreation();

    // Close the popup
    setGoalPopUpState(false);
  };

  // Stop propagation to prevent click events from being blocked
  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="pop-up" onClick={handlePopupClick}>
      <img src={swirlyDoodle} alt="curly swirls" className="swirly-doodle-left" />
      <img src={swirlyDoodle} alt="curly swirls" className="swirly-doodle-right" />
      <CgClose onClick={() => setGoalPopUpState(false)} className="exit-icon" />
      <h2 className="create-goal-title">Create Goal</h2>

      <form className="form-container" onSubmit={handleSubmit}>
        <label className='form-label'>Goal Name: </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='form-input'
          placeholder="Enter your goal"
        /><br />

        <label className='form-label'>Description: </label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='form-input'
          style={{ height: '6vw' }}
          placeholder="Describe your goal"
        /><br />

        {/* <label className='form-label'>Start Date: </label> */}
        {/* <input
          required
          type="date"
          // value={startDate.toString()}
          onChange={handleStartDateChange}
          className='form-input'
        // min={today.toString()}
        /><br />

        <label className='form-label'>End Date: </label>
        <input
          type="date"
          value={endDate.toString()}
          onChange={handleEndDateChange}
          className='form-input'
          min={startDate.toString() || today.toString()}
        /><br /> */}

        <div className="arrows-container">
          <img src={threeArrows} alt="three arrows" className="three-arrows-left" />
          <button type="submit" className="create-button" onSubmit={handleSubmit}>
            Create!
          </button>
          <img src={threeArrows} alt="three arrows" className="three-arrows-right" />
        </div>
      </form>
    </div>
  );
};

export default GoalPopUp;