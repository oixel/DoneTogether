import React from 'react';
import { useState } from 'react';
import { CgClose } from "react-icons/cg";
import "../popUp.css";
import swirlyDoodle from "../assets/icons/swirlydoodle.svg";
import threeArrows from "../assets/icons/threearrowsPopUp.svg";


interface GoalPopUpProps {
  setGoalPopUpState: (state: boolean) => void;
}

const GoalPopUp: React.FC<GoalPopUpProps> = ({ setGoalPopUpState }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');


  const today = new Date().toISOString().split('T')[0];

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (selectedDate < today) {
      alert("Start date cannot be in the past.");
    } else if(endDate && selectedDate > endDate) {
      alert("Start date cannot be after the end date.")
    } else{
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (selectedDate < today) {
      alert("End date cannot be in the past.");
    } else if(selectedDate < startDate) {
      alert("End date cannot be before the start date.")
    } else{
      setEndDate(selectedDate);
    }
  };


  return (
    <div className="pop-up">
      <img src={swirlyDoodle} alt="curly swirls" className="swirly-doodle-left"/>
      <img src={swirlyDoodle} alt="curly swirls" className="swirly-doodle-right"/>
      <CgClose onClick={() => setGoalPopUpState(false)} className= "exit-icon"/>
      <h2 className="create-goal-title">Create Goal</h2>
      
      <form className="form-container">
        <label className='form-label'>Goal Name: </label>
        <input
        type = "text"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='form-input'
        /><br/>

        <label className='form-label'>Description: </label>
        <textarea 
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className='form-input' style={{ height: '6vw' }}/> <br/>

        <label className='form-label'>Start Date: </label>
        <input 
        required
        type= "date"
        value={startDate}
        onChange={handleStartDateChange}
        className='form-input'/> <br/>

        <label className='form-label'>End Date: </label>
        <input type= "date"
        required
        value={endDate}
        onChange={handleEndDateChange}
        className='form-input'/> <br/>
      
        <div className="arrows-container">
          <img src={threeArrows} alt="three arrows" className="three-arrows-left"/>
          <button className="create-button">Create!</button>
          <img src={threeArrows} alt="three arrows" className="three-arrows-right"/>
        </div>

      </form>
      
    </div>
  );


};

export default GoalPopUp;