import React, { useState, useEffect } from 'react';

import swirlyDoodle from "../assets/icons/swirlydoodle.svg";
import threeArrows from "../assets/icons/threearrowsPopUp.svg";
import { CgClose } from "react-icons/cg";

import "../styles/popUp.css";

// Import interface for GoalData object
import { GoalData } from '../types/goalData';

interface EditPopUpPropTypes {
  goal: GoalData;
  setEditGoalState: CallableFunction;
  setNeedRefresh: CallableFunction;
}

function EditPopUp({ goal, setEditGoalState, setNeedRefresh }: EditPopUpPropTypes) {
  const [title, setTitle] = useState(goal.name);
  const [description, setDescription] = useState(goal.description);

  const today = new Date();
  const [startDate, setStartDate] = useState<Date>(new Date(goal.startDate));
  const [useEndDate, setUseEndDate] = useState<boolean>(!(goal.endDate === undefined || goal.endDate < goal.startDate));
  const [endDate, setEndDate] = useState<Date | undefined>(goal.endDate ? new Date(goal.endDate) : undefined);

  // Takes in date input string and ensures that it is properly accurate regardless of time zone
  async function parseDate(newDate: string): Promise<Date> {
    const val = newDate.split(/\D/);
    return new Date(parseInt(val[0]), parseInt(val[1]) - 1, parseInt(val[2]));
  }

  // Convert input into a proper date and update start date!
  async function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedDate = await parseDate(e.target.value);
    setStartDate(selectedDate);
  };

  // Convert input into a proper date and update end date!
  async function handleEndDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedDate = await parseDate(e.target.value);
    setEndDate(selectedDate);
  };

  const handleSubmit = () => {
    // Logic to save the edited goal with new information

    // Close the pop-up after saving
    setEditGoalState(false);
  };

  // If you change the start date while the end date is disabled, it can make the end date BEFORE the start date
  // This prevents that from occurring
  useEffect(() => {
    if (!useEndDate && endDate && startDate > endDate) setEndDate(startDate);
  }, [startDate, endDate, useEndDate])

  return (
    <div className="pop-up">
      <img src={swirlyDoodle} alt="curly swirls" className="swirly-doodle-left" />
      <img src={swirlyDoodle} alt="curly swirls" className="swirly-doodle-right" />
      <CgClose onClick={() => setEditGoalState(false)} className="exit-icon" />
      <h2 className="create-goal-title">Edit Goal</h2>

      <form className="form-container">
        <label className='form-label'>Goal Name: </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='form-input' /><br />

        <label className='form-label'>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='form-input' style={{ height: '6vw' }} /><br />

        <label className='form-label'>Start Date:</label>
        <input
          required
          type="date"
          value={startDate.toLocaleDateString("en-CA")}
          onChange={(e) => handleStartDateChange(e)}
          className='form-input'
          min={today.toLocaleDateString("en-CA")}
          max={(useEndDate && endDate) ? endDate.toLocaleDateString("en-CA") : undefined} /><br />

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
          <button className="create-button" onClick={handleSubmit}>Save!</button>
          <img src={threeArrows} alt="three arrows" className="three-arrows-right" />
        </div>

      </form>
    </div>
  );
};

export default EditPopUp;