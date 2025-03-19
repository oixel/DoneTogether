
import '../styles/User.css';

import { useState } from "react";
import { updateUserInGoal } from '../api/goalRequests.ts';

// Import interface for UserData object
import { UserData } from '../types/userData';

interface UserBarPropTypes {
    goalId: string;
    userData: UserData;
    isReadOnly: boolean;
}

function UserBar({ goalId, userData, isReadOnly }: UserBarPropTypes) {
    // Initialize completed state to what is currently stored in the database
    const [completed, setCompleted] = useState(userData.completed);

    // Update completion status on current UI and in the database
    function updateCompletion(newCompletion: boolean): void {
        // Prevents updating other users' goals
        if (!isReadOnly) {
            // Update current completion state to reflect in the checkbox
            setCompleted(newCompletion);

            // Call axios request in external API script (goalRequests.ts) to PATCH user's completion status
            updateUserInGoal({
                _id: goalId,
                userId: userData.userId,
                updateKey: 'users.$[user].completed',
                updateValue: newCompletion
            });
        }
    }

    return (
        <div className="userContainer">
            <div className="userInfo">
                <img
                    src={userData.imageUrl}
                    alt="Profile image"
                    className="profilePicture"
                    width={35}
                />
                <p>{userData.username}</p>
            </div>
            <input className="checkBox" type="checkbox" checked={completed} onChange={(e) => updateCompletion(e.target.checked)} />
        </div>
    );
}

export default UserBar;