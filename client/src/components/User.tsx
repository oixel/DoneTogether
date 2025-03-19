
import '../styles/User.css';

import { useState } from "react";
import { updateUserInGoal } from '../api/goalRequests.ts';

interface UserPropTypes {
    goalId: string;
    clerkUserData: any;
    isReadOnly: boolean;
    storedCompletedState: boolean;
}

function User({ goalId, clerkUserData, isReadOnly, storedCompletedState }: UserPropTypes) {
    // Initialize completed state to what is currently stored in the database
    const [completed, setCompleted] = useState(storedCompletedState);

    // Update completion status on current UI and in the database
    function updateCompletion(newCompletion: boolean): void {
        // Prevents updating other users' goals
        if (!isReadOnly) {
            // Update current completion state to reflect in the checkbox
            setCompleted(newCompletion);

            // Call axios request in external API script (goalRequests.ts) to PATCH user's completion status
            updateUserInGoal({
                _id: goalId,
                userId: clerkUserData.id,
                updateKey: 'users.$[user].completed',
                updateValue: newCompletion
            });
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