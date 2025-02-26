import React from 'react'

import LoginForm from "../components/LoginForm.jsx";

// var indexRouter = require('./routes/index');
// var authRouter = require('./routes/auth');

// app.use('/',)

function Login() {

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("Submitted!");
    }

    return (
        <LoginForm
            onSubmit={handleSubmit}
        />
    );
}

export default Login;