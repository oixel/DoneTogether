// Define interface for UserData objects (combination of profile data from Clerk and status data from Mongo)
export interface UserData {
    userId: string;
    username: string;
    imageUrl: string;
    joined?: boolean;
    completed?: boolean;
}