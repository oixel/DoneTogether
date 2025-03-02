import React, { useState } from 'react'

import { Link } from 'react-router';
import axios from 'axios';

import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from '../components/LoginButton';

function ServerTesting() {
    const [userInfo, setUserInfo] = useState('No data found.');
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalDescription, setNewGoalDescription] = useState('');

    const { isAuthenticated, isLoading, user } = useAuth0();

    // Query for (checking both user ID and username)
    async function checkUser(query) {
        const res = await axios.get(
            `http://localhost:8000/getUser/${query}`
        );

        return res.data.document;
    };

    async function updateUserInfo(query) {
        // If there is no query input, avoid checking for user to prevent error
        const user = (query) ? await checkUser(query) : false;

        if (user) {
            setUserInfo(`Username: ${user.username} :: User ID: ${user.auth0_id}`);
        } else {
            setUserInfo('No data found.')
        }
    }

    // 
    async function createGoal() {
        // Only create a goal if name is given
        if (newGoalName && isAuthenticated) {
            // 
            axios.post('http://localhost:8000/goal', {
                goalName: newGoalName,
                goalDescription: newGoalDescription,
                ownerID: user.sub
            }).catch(function (error) {
                console.log(error);
            });
        }

        // Wipe input bars for some sort of feedback
        document.getElementById("goalName").value = '';
        document.getElementById("goalDescription").value = '';
    }

    return (
        <>
            <br />
            <Link to="/">Back to Home</Link>
            <br />
            <br />
            <p>{userInfo}</p>
            <br />
            <label htmlFor='query'>User ID/Username: </label>
            <input type='text' name='query' onInput={(e) => updateUserInfo(e.target.value)} />
            <br />

            <br />
            <br />
            <h2>Goal Creation:</h2>
            <br />

            {/* Code for goal creation */}
            {isAuthenticated && (
                <>
                    <label htmlFor='goalName'>Goal Name: </label>
                    <input type='text' name='goalName' id='goalName' onInput={(e) => setNewGoalName(e.target.value)} style={{ marginBottom: 5 }} />
                    <br />
                    <label htmlFor='goalDescription'>Goal Description: </label>
                    <input type='text' name='goalDescription' id='goalDescription' onInput={(e) => setNewGoalDescription(e.target.value)} style={{ marginBottom: 5 }} />
                    <br />
                    <button onClick={() => createGoal()}>Create</button>
                </>
            ) || (
                    <>
                        <b><p>Login to create goals.</p></b>
                        <br />
                        <LoginButton />
                    </>
                )}
        </>
    );
}

export default ServerTesting;