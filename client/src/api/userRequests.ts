import axios from 'axios';

// Import interface for UserData object
import { UserData } from '../types/userData';

// Send a GET request to server with user's id
export async function getUserById(id: string): Promise<UserData | null> {
    try {
        // Fetch the user's profile data from Clerk
        const result = await axios.get(`http://localhost:3001/userById/${id}`);
        const clerkUserData = result.data.user;

        // Return a initialized User object with the profile data set from Clerk
        return { userId: clerkUserData.id, username: clerkUserData.username, imageUrl: clerkUserData.imageUrl };
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

// Verify whether inputted username exists in Clerk database
export async function getUserByName(username: string): Promise<UserData | null> {
    if (username) {
        try {
            const result = await axios.get(`http://localhost:3001/userByName/${username}`);
            const clerkUserData = result.data.user;

            if (clerkUserData) {
                // Return a initialized User object with the profile data set from Clerk
                return { userId: clerkUserData.id, username: clerkUserData.username, imageUrl: clerkUserData.imageUrl };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error checking if user exists:", error);
            return null;
        }
    } else {
        return null;
    }
};