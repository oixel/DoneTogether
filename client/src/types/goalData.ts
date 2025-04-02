// Import interface for UserData object
import { UserData } from './userData';

// Define interface for Goal objects in MongoDB
export interface GoalData {
    _id: string;
    name: string;
    description: string;
    ownerId: string;
    users: Array<UserData>;

    startDate: Date;
    endDate?: Date;
}