import React from 'react'

import { useAuth0 } from "@auth0/auth0-react";


function LoginButton() {
    const { logout } = useAuth0();

    return (
        <button onClick={() => logout()} > Logout</button >
    );
}

export default LoginButton;