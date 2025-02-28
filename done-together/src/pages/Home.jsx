import React from 'react'


import { Link } from "react-router";

function Home() {
    return (
        <>
            <p>This is the home page...</p>
            <Link to="/login">Login</Link>
            <br />
            <Link to="/signup">Sign Up</Link>
        </>
    );
}

export default Home;