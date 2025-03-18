import { useState, useEffect } from 'react';
// import axios from 'axios';
import '../styles/Notifications.css';

import { getUserById } from '../api/userRequests';

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

function Notification({ invitation }: { invitation: GoalData }) {
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
    const handleResponse = async (goalId: string, status: 'accepted' | 'denied') => {
        try {
            //
            // Handle acceptance / rejection of invitation requests
            //
        } catch (error) {
            console.error(`Error ${status === 'accepted' ? 'accepting' : 'denying'} request:`, error);
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
                            onClick={() => handleResponse(invitation._id, 'accepted')}
                        >
                            Accept
                        </button>
                        <button
                            className="deny-button"
                            onClick={() => handleResponse(invitation._id, 'denied')}
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