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
                <br />
                <LoginButton />
                <LogoutButton />
                <br /> <br />
                <Link to="server-testing">To Server Testing</Link>
            </div>
        </>
    );
}

export default Home;