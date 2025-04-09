import React from 'react';
import { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";

import { createGoal } from '../api/goalRequests';

import swirlyDoodle from "../assets/icons/swirlydoodle.svg";
import threeArrows from "../assets/icons/threearrowsPopUp.svg";

import "../styles/popUp.css";

interface GoalPopUpPropTypes {
  ownerId: string;
  setGoalPopUpState: CallableFunction;
  setNeedRefresh: CallableFunction;
}

// Reformat the current day of the week into a string
function getDayOfWeek(): string {
  return new Date().getUTCDay().toString();
}

// Reformat the current day of the month into a padded string
function getDayOfMonth(): string {
  return new Date().getUTCDate().toString().padStart(2, '0');
}

function GoalPopUp({ ownerId, setGoalPopUpState, setNeedRefresh }: GoalPopUpPropTypes) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [resetType, setResetType] = useState<string>('daily');
  const [weekday, setWeekday] = useState<string>(getDayOfWeek());
  const [dayOfMonth, setDayOfMonth] = useState<string>(getDayOfMonth());

  const today = new Date();
  const [startDate, setStartDate] = useState<Date>(today);
  const [useEndDate, setUseEndDate] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<Date>(today);  // Initialized to today, but can still be set to not be used

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

  // Creates a new goal in the MongoDB database
  async function handleGoalCreation(): Promise<void> {
    if (!ownerId) return;

    try {
      // Send an axios request with the goal's data and the user's id (to add the owner to the goal!)
      const goalEndDate = useEndDate ? endDate : undefined;

      // Determines the value that will be stored as the goal's "resetType" based on the different inputs
      /*
        Never: will be stored as "never"
        Daily: will be stored as "daily"
        Weekly: will be a string of a number representing the day of the week (0 = Sunday, 6 = Saturday)
        Monthly: will be stored as a string of the any day of the month where anything < 10 will be padded with a zero (e.g. 7 -> "07")
          This is to allow both weekly and monthly to coexist without overlap (since weekly is < 10 with no padding!)
      */
      const resetValue = (resetType === "weekly") ? weekday : (resetType === "monthly") ? dayOfMonth : resetType;

      await createGoal(title, description, resetValue, ownerId, startDate, goalEndDate);

      // Refresh goals list
      setNeedRefresh(true);
    } catch (err) {
      console.error("Error creating goal:", err);
    }
  }

  // Called when the create button is pressed. Checks that required parameters are filled before creating a new goal.
  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a goal name");
      return;
    }

    if (!startDate) {
      alert("Please select a start date");
      return;
    }

    // Creates a new goal in the MongoDB database
    await handleGoalCreation();

    // Close the popup
    setGoalPopUpState(false);
  };

  // Stop propagation to prevent click events from being blocked
  function handlePopupClick(e: React.MouseEvent): void {
    e.stopPropagation();
  };

  // If you change the start date while the end date is disabled, it can make the end date BEFORE the start date
  // This prevents that from occurring
  useEffect(() => {
    if (!useEndDate && endDate && startDate > endDate) setEndDate(startDate);
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

        <label className='form-label'>Reset: </label>
        <select className="form-dropdown" defaultValue="daily" onChange={(e) => setResetType(e.target.value)}>
          <option value="never">Never</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <br />

        {/* Only display weekday dropdown if the reset type is "weekly" OR day of month number input if "monthly"*/}
        {resetType == "weekly" && (
          <>
            <label className='form-label'>Day of Week: </label>
            <select className="form-dropdown" defaultValue={getDayOfWeek()} onChange={(e) => setWeekday(e.target.value)}>
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </select>
            <br />
          </>
        ) || resetType == "monthly" && (
          <>
            <label className='form-label'>Day of Month: </label>
            <input
              type="number"
              className='form-input'
              min={1}
              max={31}
              defaultValue={new Date().getUTCDate()}
              onChange={(e) => setDayOfMonth(e.target.value.padStart(2, '0'))}  // Automatically formats the inputted number to match queries
            />
            <br />
          </>
        )}

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