import React, { useState } from 'react'

import axios from 'axios';

function Goal({ id, name, description }) {
    const [displayValue, setDisplayValue] = useState('flex');

    async function deleteGoal() {
        await axios.delete(`http://localhost:8000/goal/${id}`);
        setDisplayValue('none');
    }

    return (
        <div style={{ display: displayValue, flexDirection: 'row', alignItems: 'center', height: "75px", padding: 5, backgroundColor: "lightgrey", border: "2px solid black", borderRadius: 5, marginBottom: 5 }}>
            <div style={{ flexGrow: 1 }}>
                <h1>{name || "This is the name of the goal."}</h1>
                <p>{description || "This is the description."}</p>
            </div>
            <button style={{ height: '30px', width: '30px', marginRight: '10px' }} onClick={() => deleteGoal()}>🗑️</button>
        </div >
    );
}

export default Goal;