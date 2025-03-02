import React, { useState, useEffect } from 'react'

import "../styles/home.css";

import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

import { Link } from "react-router";

import NavBar from "../components/NavBar";

import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";

import Goal from "../components/Goal"

function Home() {
    const { isAuthenticated, isLoading, user } = useAuth0();

    const [username, setUsername] = useState('');

    const [goals, setGoals] = useState([]);

    // Grab this user's username by querying for this user's Auth0 ID.
    async function getUsername() {
        if (user) {
            const res = await axios.get(
                `http://localhost:8000/getUser/${user.sub}`  // 'sub' represent's the user's unique auth0_id
            );

            setUsername(res.data.user.username);
        }
    };

    // Grabs the goals owned by this user from the MongoDB database by querying their Auth0 ID
    async function getGoals() {
        if (user) {
            const res = await axios.get(
                `http://localhost:8000/getGoals/${user.sub}`
            );

            setGoals(res.data.goalsDocument);
        }
    }

    // If finished loading and the user is properly authenticated, grab the username and update it
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            getUsername();
            getGoals();
        }
    }, [isLoading]);

    return (
        <div className="homeDiv">
            <NavBar
                isLoading={isLoading}
                isAuthenticated={isAuthenticated}
                username={username}
                profilePicture={(user) ? user.picture : ''}
            />

            <div className="nonGoalsDiv">
                <p>This is the home page...</p>
                <br />
                <LoginButton />
                <LogoutButton />
                <br /> <br />
                <Link to="/server-testing">To Server Testing</Link>
                <br /> <br />
                <hr />
                <br />
                <h2>Goals:</h2>
                <br />
            </div>

            <div className="goalsDiv">
                {(goals.length) ?
                    goals.map(goal =>
                        <Goal
                            key={goal._id}
                            id={goal._id}
                            name={goal.goalName}
                            description={goal.goalDescription}
                        />
                    )
                    : "You have no goals..."
                }
            </div>
        </div>
    );
}

export default Home;