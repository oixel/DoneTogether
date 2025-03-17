import axios from 'axios';

// Define interface for user data from Clerk
interface ClerkUser {
    id: string;
    username: string;
    imageUrl: string;
    // [key: string]: any; // Allow for other properties that might come from Clerk
}

// Send a GET request to server with user's id
export async function getUserById(id: string): Promise<ClerkUser | null> {
    try {
        const result = await axios.get(`http://localhost:3001/userById/${id}`);
        return result.data.user;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

// Verify whether inputted username exists in Clerk database
export async function checkIfUserExists(username: string, setSearchedUser: CallableFunction, setRequestSent: CallableFunction): Promise<void> {
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
};