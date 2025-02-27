import React from 'react'

import { Link } from 'react-router';

function PageNotFound() {

    return (
        <>
            <p>This page does not exist.</p>
            <Link to="/">Back to Home</Link>
        </>
    );
}

export default PageNotFound;