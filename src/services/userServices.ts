import axios from 'axios';
import { config } from '../config/config' // Ensure you have the config properly set up
import { User } from '../types'; // Make sure you have the User type defined

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await axios.get(config.api.userService.getAllUsers);
    const rawUsers = response.data;

    return rawUsers.map((user: any) => ({
      id: String(user.id),
      full_name: user.full_name ?? user.name ?? '',
      name: user.name ?? '',
      email: user.email,
      role: user.role_id,
      createdAt: user.created_at,
    }));
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await axios.get(`${config.api.userService.getUserById(id.toString())}`);
    const user = response.data;

    return {
      id: String(user.id),
      full_name: user.full_name ?? user.name ?? '',
      name: user.name ?? '',
      email: user.email,
      role: user.role_id,
      createdAt: user.created_at,
    };
  },

  createUser: async (userData: {
    full_name: string;
    email: string;
    password_hash: string;
    role_id: number;
  }): Promise<User> => {
    const response = await axios.post(config.api.userService.createUser, userData);
    const user = response.data;
    console.log('User created:', user);

    return {
      id: String(user.id),
      full_name: user.full_name ?? user.name ?? '',
      name: user.name ?? '',
      email: user.email,
      role: user.role_id,
      createdAt: user.created_at,
    };
  },

  updateUser: async (userId: string, userData: {
    full_name: string;
    email: string;
    password_hash: string;
    role_id: number;
  }): Promise<User> => {
    const response = await axios.put(config.api.userService.updateUser(userId), userData);
    const user = response.data;

    return {
      id: String(user.id),
      full_name: user.full_name ?? user.name ?? '',
      name: user.name ?? '',
      email: user.email,
      role: user.role_id,
      createdAt: user.created_at,
    };
  },
};
