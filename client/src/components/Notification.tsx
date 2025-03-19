import { useState, useEffect } from 'react';
// import axios from 'axios';
import '../styles/Notifications.css';

import { getUserById } from '../api/userRequests';
import { updateGoalUsers, updateUserInGoal } from '../api/goalRequests';

// Define interface for User objects in MongoDB
interface UserObject {
    userId: string;
    joined: boolean;
    completed: boolean;
}

// Define interface for Goal objects in MongoDB
interface GoalData {
    _id: string;
    name: string;
    description: string;
    ownerId: string;
    users: Array<UserObject>;
}

function Notification({ userId, invitation }: { userId: string, invitation: GoalData }) {
    const [ownerName, setOwnerName] = useState("");

    // On component's render, grab the owner's username
    useEffect(() => {
        getOwner(invitation.ownerId);
    }, [])


    // Grab owner's username and store it in ownerName variable
    async function getOwner(ownerId: string) {
        await getUserById(ownerId).then((owner) => setOwnerName(owner.username));
    }

    // Handle accepting or denying a request
    const handleResponse = async (accepted: boolean) => {
        try {
            // On acceptance, change user's 'joined' boolean to true
            if (accepted) {
                // Sends PATCH request through axios
                updateUserInGoal({
                    _id: invitation._id,
                    userId: userId,
                    updateKey: 'users.$[user].joined',
                    updateValue: true
                });
            } else {  // On deny, remove user from goal so the notification no longer shows up
                updateGoalUsers(invitation._id, { userId: userId }, 'remove');
            }
        } catch (error) {
            console.error(`ERROR ${accepted ? 'accepting' : 'denying'} request:`, error);
        }
    };

    return (
        <>
            {/* Only loads notification when owner's username was grabbed */}
            {ownerName && (
                <div key={invitation._id} className="notification-item">
                    <div className="notification-content">
                        <p>
                            <strong>{ownerName}</strong> invited you to join
                            <strong> {invitation.name}</strong>
                        </p>
                        {/* <span className="notification-date">{formatDate(request.createdAt)}</span> */}
                    </div>
                    <div className="notification-actions">
                        <button
                            className="accept-button"
                            onClick={() => handleResponse(true)}
                        >
                            Accept
                        </button>
                        <button
                            className="deny-button"
                            onClick={() => handleResponse(false)}
                        >
                            Decline
                        </button>
                    </div>
                </div >
            )}
        </>
    );
}

export default Notification;