import React from 'react'

import '../styles/navbar.css';

import { useAuth0 } from "@auth0/auth0-react";

import LoginButton from "./LoginButton";

function NavBar() {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return (
            <div className="navbar-container">
                <p>Loading navbar...</p>
            </div>
        )
    }

    return (
        <div className="navbar-container">
            {isAuthenticated && (
                <>
                    <img src={user.picture} alt={user.name} width={'auto'} height={'100%'} />
                    <h2>{user.name}</h2>
                </>
            ) || (
                    <p>Not Logged In.</p>
                )}
        </div>
    );
}

export default NavBar;