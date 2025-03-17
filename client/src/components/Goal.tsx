import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Goal.css';
import User from './User';

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
    // [key: string]: any; // Allow for other properties that might come from Clerk
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

    // Send a DELETE request to server based on this goal's ObjectId in MongoDB
    async function deleteGoal(): Promise<void> {
        await axios.delete(`http://localhost:3001/goal/${id}`);
        setGoalUpdated(true);
    }

    // Send a GET request to server with user's id
    async function getUserById(id: string): Promise<ClerkUser | null> {
        try {
            const result = await axios.get(`http://localhost:3001/userById/${id}`);
            return result.data.user;
        } catch (error) {
            console.error("Error fetching user:", error);
            return null;
        }
    }

    // Loops through all user objects and grabs their profile information from Clerk database
    async function getClerkUsers(): Promise<void> {
        const newClerkUsers: ClerkUser[] = [];

        // Check if users exists and is an array
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

        console.log(newClerkUsers);

        setClerkUsers(newClerkUsers);
    }

    // Update the user data whenever there is a change in users array
    useEffect(() => {
        getClerkUsers();
    }, [users]);

    // Verify whether inputted username exists in Clerk database
    async function checkIfUserExists(username: string): Promise<void> {
        if (username) {
            try {
                const result = await axios.get(`http://localhost:3001/userByName/${username}`);
                setSearchedUser(result.data.user);
                setRequestSent(false); // Reset request sent state when searching for a new user
            } catch (error) {
                console.error("Error checking if user exists:", error);
                setSearchedUser(undefined);
            }
        } else {
            setSearchedUser(undefined);
        }
    }

    // Send a goal invitation request instead of directly adding the user
    async function sendJoinRequest(): Promise<void> {
        if (searchedUser) {
            // Check if user is already part of this goal
            const userExists = users.some(user =>
                (typeof user === 'object' && user !== null && 'userId' in user && user.userId === searchedUser.id) ||
                (typeof user === 'string' && user === searchedUser.id)
            );

            if (!userExists) {
                setIsRequesting(true);

                try {
                    // Create a goal request instead of directly adding the user
                    await axios.post('http://localhost:3001/goalRequest', {
                        goalId: id,
                        goalName: name,
                        userId: searchedUser.id,
                        inviterId: currentUserId
                    });
                    console.log("Creating request with inviterId:", currentUserId);

                    // Show success state
                    setRequestSent(true);

                    // Wipe search bar
                    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
                    if (searchInput) {
                        searchInput.value = '';
                    }
                } catch (error) {
                    console.error("Error sending join request:", error);
                } finally {
                    setIsRequesting(false);
                }
            } else {
                console.log(`${searchedUser.username} is already in this goal.`);
            }
        }
    }

    // Update the completion status of the user with the given ID
    async function updateUserCompletion(userId: string, completed: boolean) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].userId == userId) {
                users[i].completed = completed;
                break;
            }
        }

        // Send axios request to update this current goal with the newly updated users array (replacing the old data)
        await axios.put('http://localhost:3001/goal', { _id: id, users: users });
    }

    return (
        <div className="goalContainer">
            <div className="goalInfo">
                <div style={{ flexGrow: 1 }}>
                    <h1>{name}</h1>
                    <p>{description}</p>
                </div>
                {isOwner && (
                    <button className="goalButton" onClick={() => deleteGoal()}>🗑️</button>
                )}
            </div>
            <div className="usersSection">
                <h3>Members</h3>
                <div className="usersList">
                    {clerkUsers.map(currentUser => (
                        <User
                            key={currentUser.id}
                            clerkUserData={currentUser}
                            completed={currentUser.completed}
                            isReadOnly={currentUserId != currentUser.id}  // Prevents user from updating other users' completion status
                            storedCompletedState={currentUser.completed}  // Set checkbox's completion to reflect stored completion status
                            updateUserCompletion={updateUserCompletion}
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
                            onChange={(e) => checkIfUserExists(e.target.value)}
                            placeholder="Search for a user by username"
                        />

                        <button
                            onClick={sendJoinRequest}
                            disabled={!searchedUser || isRequesting || requestSent}
                            className={requestSent ? "button-success" : ""}
                        >
                            {isRequesting ? "Sending..." : requestSent ? "Invitation Sent" : "Invite User"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Goal;