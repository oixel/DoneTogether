import React, { useState, useEffect } from 'react';

import swirlyDoodle from "../assets/icons/swirlydoodle.svg";
import threeArrows from "../assets/icons/threearrowsPopUp.svg";
import { CgClose } from "react-icons/cg";

import "../styles/popUp.css";

import { updateGoal } from '../api/goalRequests';

// Import interface for GoalData object
import { GoalData } from '../types/goalData';

interface EditPopUpPropTypes {
  goal: GoalData;
  setEditGoalState: CallableFunction;
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

function EditPopUp({ goal, setEditGoalState, setNeedRefresh }: EditPopUpPropTypes) {
  const [title, setTitle] = useState(goal.name);
  const [description, setDescription] = useState(goal.description);

  const [resetType, setResetType] = useState<string>(getResetType());
  const [weekday, setWeekday] = useState<string>((getResetType() == "weekly") ? goal.resetType : getDayOfWeek());
  const [dayOfMonth, setDayOfMonth] = useState<string>((getResetType() == "monthly") ? goal.resetType : getDayOfMonth());

  const today = new Date();
  const [startDate, setStartDate] = useState<Date>(new Date(goal.startDate));
  const [useEndDate, setUseEndDate] = useState<boolean>(!(goal.endDate === undefined || goal.endDate < goal.startDate));
  const [endDate, setEndDate] = useState<Date | undefined>(goal.endDate ? new Date(goal.endDate) : undefined);

  // Determines the goal's reset type based on its stored reset value (never = "never", daily = "daily", weekly = "0"->"6", monthly = "00"->"31")
  function getResetType(): string {
    if (goal.resetType == "never" || goal.resetType == "daily") return goal.resetType;
    else if ("0 1 2 3 4 5 6".includes(goal.resetType)) return "weekly";
    else return "monthly";
  }

  // Takes in date input string and ensures that it is properly accurate regardless of time zone
  async function parseDate(newDate: string): Promise<Date> {
    const val = newDate.split(/\D/);
    return new Date(parseInt(val[0]), parseInt(val[1]) - 1, parseInt(val[2]));
  }

  // Convert input into a proper date and update start date!
  async function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const selectedDate = await parseDate(e.target.value);
    setStartDate(selectedDate);
  };

  // Convert input into a proper date and update end date!
  async function handleEndDateChange(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const selectedDate = await parseDate(e.target.value);
    setEndDate(selectedDate);
  };

  // Gets called when the save button is pressed! Updates the goal's information in the MongoDB database
  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    // Prevents page from refreshing on submit
    e.preventDefault();

    // Determines the value that will be stored as the goal's "resetType" based on the different inputs
    /*
      Never: will be stored as "never"
      Daily: will be stored as "daily"
      Weekly: will be a string of a number representing the day of the week (0 = Sunday, 6 = Saturday)
      Monthly: will be stored as a string of the any day of the month where anything < 10 will be padded with a zero (e.g. 7 -> "07")
        This is to allow both weekly and monthly to coexist without overlap (since weekly is < 10 with no padding!)
    */
    const resetValue = (resetType === "weekly") ? weekday : (resetType === "monthly") ? dayOfMonth : resetType;

    // Calls PATCH request for goal data
    await updateGoal(goal._id, title, description, resetValue, startDate, (useEndDate) ? endDate : undefined);

    // Ensures that goals are refreshed to reflect changes
    setNeedRefresh(true);

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

        <label className='form-label'>Reset: </label>
        <select className="form-dropdown" defaultValue={resetType} onChange={(e) => setResetType(e.target.value)}>
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
            <select
              className="form-dropdown"
              // Grabs stored weekday value (0-6) (if one exists) or simply grab today's day of the week (if it doesn't)
              defaultValue={(getResetType() == "weekly") ? goal.resetType : getDayOfWeek()}
              onChange={(e) => setWeekday(e.target.value)}
            >
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
              // Grabs stored day of month (if one exists) or simply grab today's date (if it doesn't)
              defaultValue={(getResetType() == "monthly") ? Number(goal.resetType) : new Date().getUTCDate()}
              onChange={(e) => setDayOfMonth(e.target.value.padStart(2, '0'))}  // Automatically formats the inputted number to match queries
            />
            <br />
          </>
        )}

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
          <button className="create-button" onClick={(e) => handleSubmit(e)}>Save!</button>
          <img src={threeArrows} alt="three arrows" className="three-arrows-right" />
        </div>

      </form>
    </div>
  );
};

export default EditPopUp;