import React from 'react'


function TestButton({ userID, setUserInfo }) {


    return (
        <button onClick={() => updateUserInfo()} >Test User ID</button >
    );
}

export default TestButton;