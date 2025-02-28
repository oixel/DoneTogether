import React, { useState } from 'react'

import { Link } from 'react-router';
import axios from 'axios';

function ServerTesting() {
    const [userInfo, setUserInfo] = useState('No data found.');

    const [newUserID, setNewUserID] = useState('');
    const [newUsername, setNewUsername] = useState('');

    async function checkUser(query) {
        const res = await axios.get(
            `http://localhost:8000/checkUser/${query}`
        );

        return res.data.document;
    };

    async function updateUserInfo(query) {
        // If there is no query input, avoid checking for user to prevent error
        const user = (query) ? await checkUser(query) : false;

        if (user) {
            setUserInfo(`Username: ${user.username} :: User ID: ${user.userID}`);
        } else {
            setUserInfo('No data found.')
        }
    }

    async function createUser() {
        axios.post('http://localhost:8000/createUser/', {
            userID: newUserID,
            username: newUsername
        }).catch(function (err) {
            console.log(err);
        });
    }

    return (
        <>
            <Link to="/">Back to Home</Link>
            <br />
            <br />
            <p>{userInfo}</p>
            <br />
            <label htmlFor='query'>User ID/Username: </label>
            <input type='text' name='query' onInput={(e) => updateUserInfo(e.target.value)} />
            <br /> <br />
            <div>
                <h2>Create User:</h2>
                <br />
                <label htmlFor='userID'>User ID: </label>
                <input type='text' name='userID' style={{ marginRight: 10 }} onChange={(e) => setNewUserID(e.target.value)} />
                <label htmlFor='username'>Username: </label>
                <input type='text' name='username' onChange={(e) => setNewUsername(e.target.value)} />
                <br /> <br />
                <button onClick={() => createUser()}>Create User</button>
            </div>
        </>
    );
}

export default ServerTesting;