
import '../styles/User.css';

import { useState } from "react";

// Define the interface for user objects
// interface UserObject {
//     userId: string;
//     completed: boolean;
// }

interface UserPropTypes {
    userObject: any;
    completed: boolean;
    isReadOnly: boolean;
    storedCompletedState: boolean;
    updateUserCompletion: CallableFunction;
}

function User({ clerkUserData, isReadOnly, storedCompletedState, updateUserCompletion }: UserPropTypes) {
    // Initialize completed state to what is currently stored in the database
    const [completed, setCompleted] = useState(storedCompletedState);

    // Update completion status on current UI and in the database
    function updateCompletion(newCompletion: boolean): void {
        // Prevents updating other users' goals
        if (!isReadOnly) {
            // Update current completion state to reflect in the checkbox
            setCompleted(newCompletion);

            // Send update up to Goal component to handle axios request
            updateUserCompletion(clerkUserData.id, newCompletion);
        }
    }

    return (
        <div className="userContainer">
            <div className="userInfo">
                <img
                    src={clerkUserData.imageUrl}
                    alt="Profile image"
                    className="profilePicture"
                    width={35}
                />
                <p>{clerkUserData.username}</p>
            </div>
            <input className="checkBox" type="checkbox" checked={completed} onChange={(e) => updateCompletion(e.target.checked)} />
        </div>
    );
}

export default User;