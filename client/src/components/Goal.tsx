import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Goal.css';
import User from './User';

import { getUserById, checkIfUserExists } from '../api/userRequests.ts';
import { updateGoalUsers, deleteGoal } from '../api/goalRequests.ts';

// Define the interface for user objects (in MongoDB)
interface UserObject {
    userId: string;
    joined: string;
    completed: boolean;
}

// Define interface for user data from Clerk
interface ClerkUser {
    id: string;
    username: string;
    imageUrl: string;
}

// Define the schema for goals with updated users type
interface GoalPropTypes {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    setGoalUpdated: CallableFunction;
    users: Array<UserObject>;
    currentUserId: string; // Add the current user's ID
}

function Goal({ id, name, description, ownerId, setGoalUpdated, users, currentUserId }: GoalPropTypes) {
    const [searchedUser, setSearchedUser] = useState<ClerkUser | undefined>(undefined);
    const [clerkUsers, setClerkUsers] = useState<ClerkUser[]>([]);

    const [isRequesting, setIsRequesting] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    // Check if current user is the owner
    const isOwner = currentUserId === ownerId;

    // Loops through all user objects and grabs their profile information from Clerk database
    async function getClerkUsers(): Promise<void> {
        const newClerkUsers: ClerkUser[] = [];

        // Check if users exists and is in array
        if (users && Array.isArray(users)) {
            for (const userObject of users) {
                if (typeof userObject === 'object' && userObject !== null && 'userId' in userObject) {
                    // Handle user object format
                    const userId = userObject.userId;
                    const newClerkUser = await getUserById(userId);

                    newClerkUser.completed = userObject.completed;

                    if (newClerkUser) {
                        newClerkUsers.push(newClerkUser);
                    }
                }
            }
        }

        setClerkUsers(newClerkUsers);
    }

    // Update the user data whenever there is a change in users array
    useEffect(() => {
        getClerkUsers();
    }, [users]);

    // Send a goal invitation request instead of directly adding the user
    async function inviteUser(): Promise<void> {
        if (searchedUser) {
            // Check if user is already part of this goal
            const userExists = users.some(user =>
                (typeof user === 'object' && user !== null && 'userId' in user && user.userId === searchedUser.id) ||
                (typeof user === 'string' && user === searchedUser.id)
            );

            if (!userExists) {
                setIsRequesting(true);

                try {
                    // Add user to goal with joined set to false
                    const newUser = {
                        userId: searchedUser.id,
                        joined: false,  // New user must accept invite to join goal
                        completed: false
                    }

                    // Send PUT request to append new user to users array
                    updateGoalUsers(id, newUser, 'add');

                    // Wipe search bar
                    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
                    if (searchInput) {
                        searchInput.value = '';
                    }
                } catch (error) {
                    console.error("Error sending inviting user:", error);
                }
            } else {
                console.log(`${searchedUser.username} is already in this goal.`);
            }
        }
    }

    return (
        <div className="goalContainer">
            <div className="goalInfo">
                <div style={{ flexGrow: 1 }}>
                    <h1>{name}</h1>
                    <p>{description}</p>
                </div>
                {isOwner && (
                    <button className="goalButton" onClick={() => deleteGoal(id, setGoalUpdated)}>🗑️</button>
                )}
            </div>
            <div className="usersSection">
                <h3>Members</h3>
                <div className="usersList">
                    {clerkUsers.map(currentUser => (
                        <User
                            key={currentUser.id}
                            goalId={id}
                            clerkUserData={currentUser}
                            completed={currentUser.completed}
                            isReadOnly={currentUserId != currentUser.id}  // Prevents user from updating other users' completion status
                            storedCompletedState={currentUser.completed}  // Set checkbox's completion to reflect stored completion status
                        />
                    ))}
                </div>

                {isOwner && (
                    <div className="addUser">
                        <div className="searchStatus">
                            {searchedUser && !requestSent && (
                                <span className="userFound">✅ User found</span>
                            )}
                            {!searchedUser && (
                                <span className="userNotFound">❌ No user found</span>
                            )}
                            {requestSent && (
                                <span className="requestSent">✓ Invitation sent</span>
                            )}
                        </div>

                        <input
                            id="searchInput"
                            type="text"
                            onChange={(e) => checkIfUserExists(e.target.value, setSearchedUser, setRequestSent)}
                            placeholder="Search for a user by username"
                        />

                        <button
                            onClick={() => inviteUser()}
                            disabled={!searchedUser || isRequesting || requestSent}
                            className={requestSent ? "button-success" : ""}
                        >
                            {isRequesting ? "Sending..." : requestSent ? "Invitation Sent" : "Invite User"}
                        </button>
                    </div>
                )}
            </div>
        </div >
    );
}

export default Goal;