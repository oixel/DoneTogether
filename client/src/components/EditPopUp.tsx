import React, { useState } from 'react';

import swirlyDoodle from "../assets/icons/swirlydoodle.svg";
import threeArrows from "../assets/icons/threearrowsPopUp.svg";
import { CgClose } from "react-icons/cg";
import "../styles/popUp.css";

import { GoalData } from '../types/goalData';


interface EditPopUpProps {
  goal: GoalData;  // use goalData type
  setEditGoalState: (state: boolean) => void;
}

const EditPopUp: React.FC<EditPopUpProps> = ({ goal, setEditGoalState }) => {
  const [title, setTitle] = useState(goal.name);
  const [description, setDescription] = useState(goal.description);

  const today = new Date();
  const [startDate, setStartDate] = useState(goal.startDate);
  const [useEndDate, setUseEndDate] = useState<boolean>(false);
  const [endDate, setEndDate] = useState(goal.endDate ? goal.endDate : today);

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

  async function parseDate(newDate: string): Promise<Date> {
    const val = newDate.split(/\D/);
    return new Date(parseInt(val[0]), parseInt(val[1]) - 1, parseInt(val[2]));
  }

  const handleSave = () => {
    // Logic to save the edited goal with new information
    
    // Close the pop-up after saving
    setEditGoalState(false); 
  };

  return (
    <div className="pop-up">
    <img src={swirlyDoodle} alt="curly swirls" className="swirly-doodle-left"/>
      <img src={swirlyDoodle} alt="curly swirls" className="swirly-doodle-right"/>
      <CgClose onClick={() => setEditGoalState(false)} className= "exit-icon"/>
      <h2 className="create-goal-title">Edit Goal</h2>

     <form className="form-container">
        <label className='form-label'>Goal Name: </label>
        <input 
        type = "text"
        required
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        className='form-input' /><br/>
      
      <label className='form-label'>Description:</label>
      <textarea 
      value={description} 
      onChange={(e) => setDescription(e.target.value)}
      className='form-input' style={{ height: '6vw' }}/><br/>
      
      <label className='form-label'>Start Date:</label>
      <input 
      required
      type="date"
      value={startDate.toLocaleDateString("en-CA")}
      onChange={(e) => handleStartDateChange(e)}
      className='form-input'
      min={today.toLocaleDateString("en-CA")}
      max={(useEndDate) ? endDate.toLocaleDateString("en-CA") : undefined}/><br/>
      
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
          <img src={threeArrows} alt="three arrows" className="three-arrows-left"/>
          <button className="create-button" onClick = { handleSave }>Save!</button>
          <img src={threeArrows} alt="three arrows" className="three-arrows-right"/>
        </div>
     
      </form>
    </div>
  );
};

export default EditPopUp;