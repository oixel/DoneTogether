import React from 'react';
import { useState } from 'react';
import { CgClose } from "react-icons/cg";
import "../styles/popUp.css";
import swirlyDoodle from "../assets/icons/swirlydoodle.svg";
import threeArrows from "../assets/icons/threearrowsPopUp.svg";

interface Goal {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  userID: number;
  goalID?: number;
}

interface GoalPopUpProps {
  setGoalPopUpState: (state: boolean) => void;
  onAddGoal?: (newGoal: Omit<Goal, 'goalID'>) => void;
  isEdit?: boolean;
  existingGoal?: Omit<Goal, 'goalID'>;
}

const GoalPopUp: React.FC<GoalPopUpProps> = ({ 
  setGoalPopUpState, 
  onAddGoal,
  isEdit = false,
  existingGoal 
}) => {
  const [title, setTitle] = useState<string>(existingGoal?.title || '');
  const [description, setDescription] = useState<string>(existingGoal?.description || '');
  const [startDate, setStartDate] = useState<string>(existingGoal?.startDate || '');
  const [endDate, setEndDate] = useState<string>(existingGoal?.endDate || '');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("Please enter a goal name");
      return;
    }
    
    if (!description.trim()) {
      alert("Please enter a description");
      return;
    }
    
    if (!startDate) {
      alert("Please select a start date");
      return;
    }
    
    if (!endDate) {
      alert("Please select an end date");
      return;
    }
    
    // Create the new goal
    const newGoal = {
      title,
      description,
      startDate,
      endDate,
      userID: existingGoal?.userID || 12345, // This would come from the authenticated user
    };
    
    // Call the onAddGoal callback if it exists
    if (onAddGoal) {
      onAddGoal(newGoal);
    }
    
    // Close the popup
    setGoalPopUpState(false);
  };
  
  // Format date to YYYY-MM-DD for input[type="date"]
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    
    // Check if date is already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // If the date is in MM/DD/YYYY format, convert it
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [month, day, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    return dateString;
  };

  // Stop propagation to prevent click events from being blocked
  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div className="pop-up" onClick={handlePopupClick}>
      <img src={swirlyDoodle} alt="curly swirls" className="swirly-doodle-left"/>
      <img src={swirlyDoodle} alt="curly swirls" className="swirly-doodle-right"/>
      <CgClose onClick={() => setGoalPopUpState(false)} className="exit-icon"/>
      <h2 className="create-goal-title">{isEdit ? 'Edit Goal' : 'Create Goal'}</h2>
      
      <form className="form-container" onSubmit={handleSubmit}>
        <label className='form-label'>Goal Name: </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='form-input'
          placeholder="Enter your goal"
        /><br/>
        
        <label className='form-label'>Description: </label>
        <textarea 
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='form-input' 
          style={{ height: '6vw' }}
          placeholder="Describe your goal"
        /><br/>
        
        <label className='form-label'>Start Date: </label>
        <input 
          required
          type="date"
          value={formatDateForInput(startDate)}
          onChange={handleStartDateChange}
          className='form-input'
          min={today}
        /><br/>
        
        <label className='form-label'>End Date: </label>
        <input 
          type="date"
          required
          value={formatDateForInput(endDate)}
          onChange={handleEndDateChange}
          className='form-input'
          min={startDate || today}
        /><br/>
      
        <div className="arrows-container">
          <img src={threeArrows} alt="three arrows" className="three-arrows-left"/>
          <button type="submit" className="create-button">
            {isEdit ? 'Finished!' : 'Create!'}
          </button>
          <img src={threeArrows} alt="three arrows" className="three-arrows-right"/>
        </div>
      </form>
    </div>
  );
};

export default GoalPopUp;