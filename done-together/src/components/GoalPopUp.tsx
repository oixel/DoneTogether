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
        <textarea className='form-input' style={{ height: '6vw' }}/> <br/>

        <label className='form-label'>Start Date: </label>
        <input type= "date" className='form-input'/> <br/>

        <label className='form-label'>End Date: </label>
        <input type= "date" className='form-input'/> <br/>
      
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