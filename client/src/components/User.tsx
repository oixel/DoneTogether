
import '../styles/User.css';

import { useState, useEffect } from "react";
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
    async function updateCompletion(newCompletion: boolean): Promise<void> {
        // Prevents updating other users' goals
        if (!isReadOnly) {
            // Update current completion state to reflect in the checkbox
            setCompleted(newCompletion);

            // Call axios request in external API script (goalRequests.ts) to PATCH user's completion status
            await updateUserInGoal({
                _id: goalId,
                userId: userData.userId,
                updateKey: 'users.$[user].completed',
                updateValue: newCompletion
            });
        }
    }

    // Whenever the user's completed status is updated in the Goal database, update checkbox to reflect completion
    useEffect(() => {
        setCompleted(userData.completed);
    }, [userData])

    return (
        <div className={`userContainer ${(userData.joined) ? "joinedUser" : "pendingUser"
            } `}>
            <div className="userInfo">
                <img
                    src={userData.imageUrl}
                    alt="Profile image"
                    className="profilePicture"
                    width={35}
                />
                <p>{userData.username}</p>
            </div>
            {/* Show user's checkbox OR "Pending" texting depending on whether the collaborator has accepted the invite */}
            {userData.joined && (
                <input
                    className="checkBox"
                    type="checkbox"
                    checked={completed}
                    onChange={(e) => updateCompletion(e.target.checked)}
                />
            ) || !userData.joined && (
                <p className="pendingText"><strong>Pending...</strong></p>
            )}
        </div>
    );
}

export default UserBar;