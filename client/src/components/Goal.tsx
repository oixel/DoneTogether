import { useCallback, useEffect, useState } from 'react';
import '../styles/Goal.css';
import UserBar from './UserBar.tsx';

import { getUserById, getUserByName } from '../api/userRequests.ts';
import { updateGoalUsers, deleteGoal } from '../api/goalRequests.ts';

// Import interface for UserData object
import { UserData } from '../types/userData';

// Define the schema for goals with updated users type
interface GoalPropTypes {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    setGoalUpdated: CallableFunction;
    mongoDBUserData: Array<UserData>;
    currentUserId: string; // Add the current user's ID
}

function Goal({ id, name, description, ownerId, setGoalUpdated, mongoDBUserData, currentUserId }: GoalPropTypes) {
    const [searchedUser, setSearchedUser] = useState<UserData | null>(null);
    const [users, setUsers] = useState<UserData[]>([]);

    const [isRequesting, setIsRequesting] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    // Check if current user is the owner
    const isOwner = currentUserId === ownerId;

    // Loops through all user objects and grabs their profile information from Clerk database and combines it with their respective statuses from MongoDB
    // Using Callback to prevent unnecessarry re-renders from the useEffect call
    const getUsers = useCallback(async () => {
        // Initialize empty array to append all user data for this goal into
        const newUsers: Array<UserData> = [];

        // Check if users exists and is in array
        if (mongoDBUserData && Array.isArray(mongoDBUserData)) {
            for (const userData of mongoDBUserData) {
                if (userData !== null) {
                    // Handle user object format
                    const userId = userData.userId;

                    // Initialize newUser to have all of the user's data from Clerk database
                    const newUser = await getUserById(userId);

                    // Only continue if newUser is not null
                    if (newUser) {
                        // Append the user's statuses for this goal to the user's object
                        newUser.joined = userData.joined;
                        newUser.completed = userData.completed;

                        // 
                        newUsers.push(newUser);
                    }
                }
            }
        }

        setUsers(newUsers);
    }, [mongoDBUserData]);

    // Update the user data whenever there is a change in this goal's user's array in MongoDB
    useEffect(() => {
        getUsers();
    }, [mongoDBUserData, getUsers]);

    // Store User object or null in 'searchedUser' based on search
    async function checkIfUserExists(usernameInput: string): Promise<void> {
        // Reset isRequesting when a new username is input
        setIsRequesting(false);

        // Update searched user to a User object (if a user is found) or null (if not)
        const user = await getUserByName(usernameInput);
        setSearchedUser(user);
    }

    // Send a goal invitation request instead of directly adding the user
    async function inviteUser(): Promise<void> {
        if (searchedUser) {
            // Check if user is already part of this goal
            const userExists = mongoDBUserData.some(user =>
                (typeof user === 'object' && user !== null && 'userId' in user && user.userId === searchedUser.userId) ||
                (typeof user === 'string' && user === searchedUser.userId)
            );

            if (!userExists) {
                setIsRequesting(true);

                try {
                    // Add user to goal with joined set to false
                    const newUser = {
                        userId: searchedUser.userId,
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

                    // Update statuses to reflect successful send
                    setIsRequesting(false);
                    setRequestSent(true);
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
                    {users.map(currentUser => {
                        if (currentUser.joined) {
                            return (
                                <UserBar
                                    key={currentUser.userId}
                                    goalId={id}
                                    userData={currentUser}
                                    isReadOnly={currentUserId != currentUser.userId}  // Prevents user from updating other users' completion status
                                />
                            )
                        }
                    }
                    )}
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
                            onChange={(e) => checkIfUserExists(e.target.value)}
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