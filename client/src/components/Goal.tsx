import axios from 'axios';

import '../styles/Goal.css';

interface GoalPropTypes {
    id: string;
    name: string;
    description: string;
    setUpdated: CallableFunction;
}

function Goal({ id, name, description, setUpdated }: GoalPropTypes) {
    // Send a DELETE request to server based on this goal's ObjectId in MongoDB
    async function deleteGoal(): Promise<void> {
        await axios.delete(`http://localhost:3001/goal/${id}`);
        setUpdated(true);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: "75px", padding: 5, backgroundColor: "lightgrey", border: "2px solid black", borderRadius: 5, marginBottom: 5 }}>
            <div style={{ flexGrow: 1 }}>
                <h1>{name || "This is the name of the goal."}</h1>
                <p>{description || "This is the description."}</p>
            </div>
            <button style={{ height: '30px', width: '30px', marginRight: '10px' }} onClick={() => deleteGoal()}>🗑️</button>
        </div >
    );
}

export default Goal;