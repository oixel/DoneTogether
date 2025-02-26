import React from 'react'

import { Link, Outlet } from "react-router";

function LoginLayout() {

    return (
        <>
            <Link to="/">Back Home</Link>
            <p>This is the LoginLayout component.</p>

            {/* Part of react router that applies child based on route. */}
            {/* If "/login" then Outlet represents <Login /> if "/signup" then Outlet represents <SignUp /> */}
            <Outlet />
        </>
    );
}

export default LoginLayout;