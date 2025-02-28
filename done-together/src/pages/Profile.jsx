import React, { useState, useEffect } from 'react'

import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router";

import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';

import axios from 'axios';

function Profile() {
    const { isAuthenticated, isLoading, user } = useAuth0();

    const [username, setUsername] = useState('');

    // Grab this user's username by querying for this user's Auth0 ID.
    async function getUsername() {
        const res = await axios.get(
            `http://localhost:8000/getUser/${user.sub}`  // 'sub' represent's the user's unique auth0_id
        );

        // Update username variable to contain user's unique username 
        setUsername(res.data.document.username);
    };

    // If finished loading and the user is properly authenticated, grab the username and update it
    useEffect(() => {
        if (!isLoading && isAuthenticated) getUsername();
    }, [isLoading])

    if (isLoading) {
        return <div>Loading Profile...</div>
    }

    return (
        <>
            <Link to="/">Back to Home</Link>
            {/* Display user data if logged in */}
            {isAuthenticated && (
                <div>
                    <img src={user.picture} alt={user.name} width={250} height={250} />
                    <h2>Username: {username}</h2>
                    <p>Email: {user.email}</p>
                    <br />
                    <LogoutButton />
                </div>
            ) || ( // Otherwise, display login button
                    <div>
                        <h2>Not logged in!</h2>
                        <LoginButton />
                    </div>
                )}
        </>
    );
};

export default Profile;