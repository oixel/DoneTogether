import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Goal.css';
import User from './User';

// Define the interface for user objects
interface UserObject {
    userId: string;
    username?: string;
    joinedAt?: Date;
    role?: string;
}

// Define interface for user data from Clerk
interface ClerkUser {
    id: string;
    username: string;
    imageUrl: string;
    [key: string]: any; // Allow for other properties that might come from Clerk
}

// Define the schema for goals with updated users type
interface GoalPropTypes {
    id: string;
    name: string;
    description: string;
    setGoalUpdated: CallableFunction;
    users: Array<UserObject>;
}

function Goal({ id, name, description, setGoalUpdated, users }: GoalPropTypes) {
    const [searchedUser, setSearchedUser] = useState<ClerkUser | undefined>(undefined);
    const [usersData, setUsersData] = useState<ClerkUser[]>([]);

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

    // Loops through all user objects and grabs their data from Clerk database
    async function getUsers(): Promise<void> {
        const newUsers: ClerkUser[] = [];

        // Check if users exists and is an array
        if (users && Array.isArray(users)) {
            for (const userObj of users) {
                if (typeof userObj === 'object' && userObj !== null && 'userId' in userObj) {
                    // Handle user object format
                    const userId = userObj.userId;
                    const newUser = await getUserById(userId);
                    if (newUser) {
                        newUsers.push(newUser);
                    }
                } else if (typeof userObj === 'string') {
                    // Handle the case where users might still be strings during transition
                    const newUser = await getUserById(userObj);
                    if (newUser) {
                        newUsers.push(newUser);
                    }
                }
            }
        }

        setUsersData(newUsers);
    }

    // Update the user data whenever there is a change in users array
    useEffect(() => {
        getUsers();
    }, [users]);

    // Verify whether inputted username exists in Clerk database
    async function checkIfUserExists(username: string): Promise<void> {
        if (username) {
            try {
                const result = await axios.get(`http://localhost:3001/userByName/${username}`);
                setSearchedUser(result.data.user);
            } catch (error) {
                console.error("Error checking if user exists:", error);
                setSearchedUser(undefined);
            }
        } else {
            setSearchedUser(undefined);
        }
    }

    // Attempt to add user to goal's array of users in MongoDB
    async function addUser(): Promise<void> {
        if (searchedUser) {
            // Check if user is already part of this goal
            const userExists = users.some(user => 
                (typeof user === 'object' && user !== null && 'userId' in user && user.userId === searchedUser.id)
            );
            
            if (!userExists) {
                // Create new user object
                const newUserObj = {
                    userId: searchedUser.id,
                    username: searchedUser.username,
                    joinedAt: new Date(),
                    role: 'member'
                };
                
                // Pass the goal's ObjectId for querying and newUserObj to append to its array
                try {
                    await axios.put('http://localhost:3001/goal', {
                        _id: id,
                        newUserObj: newUserObj
                    });
                    
                    // Wipe search bar if adding was successful
                    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
                    if (searchInput) {
                        searchInput.value = '';
                    }
                } catch (error) {
                    console.error("Error adding user to goal:", error);
                }
            } else {
                console.log(`${searchedUser.username} is already in this goal.`);
            }

            // Set updated to true to cause goal to re-render
            setGoalUpdated(true);
        }
    }

    return (
        <div className="goalContainer">
            <div className="goalInfo">
                <div style={{ flexGrow: 1 }}>
                    <h1>{name}</h1>
                    <p>{description}</p>
                </div>
                <button className="goalButton" onClick={() => deleteGoal()}>🗑️</button>
            </div>
            <div className="usersSection">
                {usersData.map(currentUser => (
                    <User
                        key={currentUser.id}
                        imageUrl={currentUser.imageUrl}
                        username={currentUser.username}
                    />
                ))}
                <div className="addUser">
                    {/* Displays whether searchedUser actually exists in Clerk database */}
                    <p>{searchedUser ? '✅' : '❌'}</p>
                    <input 
                        id="searchInput" 
                        type="text" 
                        onChange={(e) => checkIfUserExists(e.target.value)} 
                        placeholder='Enter username here.'
                    />
                    <button onClick={() => addUser()}>Add User +</button>
                </div>
            </div>
        </div>
    );
}

export default Goal;