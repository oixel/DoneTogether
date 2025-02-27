import React, { useState } from 'react'

import { Link } from 'react-router';
import axios from 'axios';

function ServerTesting() {
    const [userInfo, setUserInfo] = useState('No data found.');

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

    return (
        <>
            <Link to="/">Back to Home</Link>
            <br />
            <br />
            <p>{userInfo}</p>
            <br />
            <label htmlFor='userId'>User ID: </label>
            <input type='text' name='userID' onInput={(e) => updateUserInfo(e.target.value)}></input>
        </>
    );
}

export default ServerTesting;