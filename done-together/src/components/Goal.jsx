import React from 'react'

function Goal({ name, description }) {

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: "75px", padding: 5, backgroundColor: "lightgrey", border: "2px solid black", borderRadius: 5, marginBottom: 5 }}>
            <h1>{name || "This is the name of the goal."}</h1>

            <p>{description || "This is the description."}</p>
        </div>
    );
}

export default Goal;