import React from 'react';

import { Link } from 'react-router';

function LoginForm({ onSubmit }) {
    return (
        // When form is submitted, call passed-in function
        <form onSubmit={onSubmit}>
            <section>
                <label for="username">Username: </label>
                <input id="username" type="text" name="username" autoComplete='username' required />
            </section>
            <section>
                <label for="password">Password: </label>
                <input id="password" type="password" name="password" autoComplete='current-password' required />
            </section>

            <button type="submit">Log In</button>
        </form >
    );
}

export default LoginForm;