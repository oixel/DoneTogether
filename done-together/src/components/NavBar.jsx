import React from 'react'

import '../styles/navbar.css';

import { Link } from 'react-router';

function NavBar({ isLoading, isAuthenticated, username, profilePicture }) {
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
                    <img src={profilePicture} alt={username} width={'auto'} height={'100%'} />
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