import React, { useState } from 'react';
import { CgClose } from "react-icons/cg";
import "../styles/popUp.css";
import swirlyDoodle from "../assets/icons/swirlydoodle.svg";
import threeArrows from "../assets/icons/threearrowsPopUp.svg";


interface EditPopUpProps {
  goal: { title: string; description: string; startDate: string; endDate: string; goalID: number };
  setGoalPopUpState: (state: boolean) => void;
}

const EditPopUp: React.FC<EditPopUpProps> = ({ goal, setGoalPopUpState }) => {
  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description);
  const [startDate, setStartDate] = useState(goal.startDate);
  const [endDate, setEndDate] = useState(goal.endDate);

  const handleSave = () => {
    // Logic to save the edited goal
    setGoalPopUpState(false); // Close the pop-up after saving
  };

  return (
    <div className="pop-up">
    <img src={swirlyDoodle} alt="curly swirls" className="swirly-doodle-left"/>
      <img src={swirlyDoodle} alt="curly swirls" className="swirly-doodle-right"/>
      <CgClose onClick={() => setGoalPopUpState(false)} className= "exit-icon"/>
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
      className='form-input' style={{ height: '6vw' }}/> <br/>
      
      <label className='form-label'>Start Date:</label>
      <input 
      type="date" 
      value={startDate} 
      onChange={(e) => setStartDate(e.target.value)} 
      className='form-input'/><br/>
      
      <label className='form-label'>End Date:</label>
      <input 
      type="date" 
      value={endDate} 
      onChange={(e) => setEndDate(e.target.value)} 
      className='form-input'/><br/>
      
      <div className="arrows-container">
          <img src={threeArrows} alt="three arrows" className="three-arrows-left"/>
          <button className="create-button">Save!</button>
          <img src={threeArrows} alt="three arrows" className="three-arrows-right"/>
        </div>
     
      </form>
    </div>
  );
};

export default EditPopUp;