import React from 'react'

import { Link } from "react-router";

function LogOut() {
    return (
        <>
            <p>You are now logged out!</p>
            <Link to="/">Back to Home</Link>
        </>
    );
}

export default LogOut;