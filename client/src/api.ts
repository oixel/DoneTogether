import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';




const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  // @ts-expect-error Clerk is loaded globally (in the app) but TypeScript doesn't know about it
  const token = await window.Clerk?.session?.getToken();
   
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
 
  return config;
});

export interface UserData {
  email?: string;
  username?: string | null;
  profileImageUrl?: string;
}

export interface Goal {
  _id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  ownerID: string;
  username: string;
  goalID?: number;
  collaborators: Collaborator[];
}

export interface Collaborator {
  userID: string;
  username: string;
  completion: boolean;
}

export const syncUserWithMongoDB = async (userData: UserData) => {
  const response = await api.post('/api/user/sync', userData);
  return response.data;
};

export const getUserData = async () => {
  const response = await api.get('/api/user');
  return response.data;
};


