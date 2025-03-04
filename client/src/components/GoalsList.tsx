// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

import Goal from "./Goal";

import '../styles/GoalsList.css'

const Dashboard = () => {
    const { isLoaded, isSignedIn, user } = useUser();

    const [goals, setGoals] = useState([]);

    const [updated, setUpdated] = useState(false);

    // Send GET request to server to query all goals created by this user
    async function getGoals(): Promise<void> {
        if (user) {
            try {
                const res = await axios.get(
                    `http://localhost:3001/getGoals/${user.id}`
                );

                setGoals(res.data.goals);

                // Toggle updated back to false since goals have been refreshed
                if (updated) setUpdated(false);
            } catch (error) {
                console.error(`Failed to fetch goals: ${error}.`);
            }
        }
    }

    // Send POST request to server to create a new goal for the current user
    async function createGoal(): Promise<void> {
        if (isSignedIn) {
            axios.post('http://localhost:3001/goal', {
                name: 'filler name',
                description: 'filler description',
                ownerId: user.id
            }).catch(function (error) {
                console.log(error);
            });

            // Set updated to true to cause goal refresh
            setUpdated(true);
        }
    }

    // Update the goals displayed if page is finally loaded or the goals have been updated
    useEffect(() => {
        if (isLoaded && isSignedIn) getGoals();
    }, [isLoaded, updated]);

    // Display loading text while user's information gets loaded
    if (!isLoaded) {
        return <div>Loading goals...</div>;
    }

    return (
        <div className="goals">
            <div className="goalsDiv">
                {(goals.length) ?
                    goals.map(goal =>
                        <Goal
                            key={goal._id}
                            id={goal._id}
                            name={goal.name}
                            description={goal.description}
                            setUpdated={setUpdated}
                        />
                    )
                    : "You have no goals..."
                }
            </div>
            <button onClick={() => createGoal()}>Create Goal +</button>
        </div>
    );
};

export default Dashboard;