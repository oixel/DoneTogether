import React from 'react';
import { useState, useEffect } from 'react';
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

  const today = new Date();
  const [startDate, setStartDate] = useState<Date>(today);
  const [useEndDate, setUseEndDate] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<Date>(today);  // Initialized to today, but can still be set to not be used

  async function parseDate(newDate: string): Promise<Date> {
    const val = newDate.split(/\D/);
    return new Date(parseInt(val[0]), parseInt(val[1]) - 1, parseInt(val[2]));
  }

  // 
  async function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Convert input into a proper date and update start date!
    const selectedDate = await parseDate(e.target.value);
    setStartDate(selectedDate);
  };

  // 
  async function handleEndDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Convert input into a proper date and update end date!
    const selectedDate = await parseDate(e.target.value);
    setEndDate(selectedDate);
  };

  // Function to create a new goal
  async function handleGoalCreation(): Promise<void> {
    if (!ownerId) return;

    try {
      // Send an axios request with the goal's data and the user's id (to add the owner to the goal!)
      const goalEndDate = useEndDate ? endDate : undefined;
      await createGoal(title, description, ownerId, startDate, goalEndDate);

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

    if (!startDate) {
      alert("Please select a start date");
      return;
    }

    // 
    await handleGoalCreation();

    // Close the popup
    setGoalPopUpState(false);
  };

  // Stop propagation to prevent click events from being blocked
  function handlePopupClick(e: React.MouseEvent) {
    e.stopPropagation();
  };

  // 
  useEffect(() => {
    if (!useEndDate && startDate > endDate) setEndDate(startDate);
  }, [startDate, endDate, useEndDate])


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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='form-input'
          style={{ height: '6vw' }}
          placeholder="Describe your goal"
        /><br />

        <label className='form-label'>Start Date: </label>
        <input
          required
          type="date"
          value={startDate.toLocaleDateString("en-CA")}
          onChange={(e) => handleStartDateChange(e)}
          className='form-input'
          min={today.toLocaleDateString("en-CA")}
          max={(useEndDate) ? endDate.toLocaleDateString("en-CA") : undefined}
        /><br />

        <div>
          <label className='form-label'>Use End Date</label>
          <input type="checkbox" checked={useEndDate} onChange={(e) => setUseEndDate(e.target.checked)} />
        </div>

        {/* Only display end date input if useEndDate is set to true (allows goals without end dates to exist */}
        {useEndDate && (
          <>
            <label className='form-label'>End Date: </label>
            <input
              type="date"
              value={endDate?.toLocaleDateString("en-CA")}
              onChange={(e) => handleEndDateChange(e)}
              className='form-input'
              min={startDate.toLocaleDateString("en-CA")}
            /><br />
          </>
        )}

        <div className="arrows-container">
          <img src={threeArrows} alt="three arrows" className="three-arrows-left" />
          <button type="submit" className="create-button" onSubmit={handleSubmit}>
            Create!
          </button>
          <img src={threeArrows} alt="three arrows" className="three-arrows-right" />
        </div>
      </form>
    </div >
  );
};

export default GoalPopUp;