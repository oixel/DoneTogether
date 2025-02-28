import React, { useState, useEffect } from 'react'

import '../styles/navbar.css';

import { useAuth0 } from "@auth0/auth0-react";

import { Link } from 'react-router';

import axios from 'axios';

function NavBar() {
    const { isAuthenticated, isLoading, user } = useAuth0();

    const [username, setUsername] = useState('');

    // Grab this user's username by querying for this user's Auth0 ID.
    async function getUsername() {
        if (user) {
            const res = await axios.get(
                `http://localhost:8000/getUser/${user.sub}`  // 'sub' represent's the user's unique auth0_id
            );

            setUsername(res.data.document.username);
        }
    };

    // If finished loading and the user is properly authenticated, grab the username and update it
    useEffect(() => {
        if (!isLoading && isAuthenticated) getUsername();
    }, [isLoading])


    // Display loading text while loading navbar
    if (isLoading) {
        return (
            <div className="navbar-container">
                <p>Loading navbar...</p>
            </div>
        )
    }

    return (
        <div className="navbar-container">
            {/* Display user's profile picture and username in navbar if logged in */}
            {isAuthenticated && (
                <>
                    <img src={user.picture} alt={user.username} width={'auto'} height={'100%'} />
                    <h1 style={{ marginLeft: 10 }}>{username}</h1>
                    <Link to="profile" style={{ marginLeft: 'auto', marginTop: 10, marginRight: 15, color: 'white', textDecoration: 'none' }}>View Profile</Link>
                </>
            ) || (  // Otherwise, display text showing user is not logged in
                    <>
                        <p style={{ marginLeft: 15, marginTop: 10 }}>Not Logged In.</p>
                        <Link to="profile" style={{ marginLeft: 'auto', marginTop: 10, marginRight: 15, color: 'white', textDecoration: 'none' }}>View Profile</Link>
                    </>
                )}
        </div>
    );
}

export default NavBar;