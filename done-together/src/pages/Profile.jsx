import React from 'react'

import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router";

import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';

function Profile() {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading Profile...</div>
    }

    return (
        <>
            <Link to="/">Back to Home</Link>
            {isAuthenticated && (
                <div>
                    <img src={user.picture} alt={user.name} width={250} height={250} />
                    <h2>Username: {user.given_name}</h2>
                    <p>Email: {user.email}</p>
                    <br />
                    <LogoutButton />
                </div>
            ) || (
                    <div>
                        <h2>Not logged in!</h2>
                        <LoginButton />
                    </div>
                )}
        </>
    );
};

export default Profile;