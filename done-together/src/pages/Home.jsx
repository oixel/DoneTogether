import React from 'react'

import "../styles/home.css";

import { Link } from "react-router";

import NavBar from "../components/NavBar";

import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";

function Home() {
    return (
        <>
            <NavBar />
            <div className="home-container">
                <p>This is the home page...</p>

                <Link to="profile">View Profile</Link>
                <br />
                <LoginButton />
                <br />
                <LogoutButton />
            </div>
        </>
    );
}

export default Home;