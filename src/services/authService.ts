import { User, UserCredentials, UserRegistration } from '../types';
import { generateUUID } from '../lib/utils';

// Mock users database
const USERS_KEY = 'tms_users';

const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Initialize with admin user if no users exist
const initUsers = () => {
  const users = getUsers();
  if (users.length === 0) {
    const adminUser: User = {
      id: generateUUID(),
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    saveUsers([adminUser]);
  }
};

// Initialize users on module load
initUsers();

// export const authService = {


//   login: async (credentials: UserCredentials): Promise<User> => {
//     // Simulate network request
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     const users = getUsers();
//     const user = users.find(u => u.email === credentials.email);
    
//     if (!user) {
//       throw new Error('User not found');
//     }
    
//     // In a real app, we would validate the password here
//     // This is just for demo purposes
    
//     return user;
//   },
  
//   register: async (userData: UserRegistration): Promise<User> => {
//     // Simulate network request
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     const users = getUsers();
    
//     // Check if user already exists
//     if (users.some(u => u.email === userData.email)) {
//       throw new Error('User with this email already exists');
//     }
    
//     // Create new user
//     const newUser: User = {
//       id: generateUUID(),
//       email: userData.email,
//       name: userData.name,
//       role: userData.role,
//       createdAt: new Date().toISOString(),
//     };
    
//     // Save to "database"
//     saveUsers([...users, newUser]);
    
//     return newUser;
//   },
  
//   getCurrentUser: async (): Promise<User | null> => {
//     // In a real app, this would validate the token with the server
//     const userJson = localStorage.getItem('user');
//     return userJson ? JSON.parse(userJson) : null;
//   }
// };


// services/authService.ts
import axios from 'axios';
import { config } from '../config/config';



const mapRoleIdToRole = (roleId: number): 'user' | 'admin' => {
  switch (roleId) {
    case 1:
      return 'user';
    case 2:
      return 'admin';
    default:
      throw new Error('Unknown role ID');
  }
};

export const authService = {
  login: async (credentials: UserCredentials): Promise<User> => {
    const response = await axios.post(`${config.api.auth.login}`, credentials);
    console.log('Login response:', response.data);
    const userData = response.data;

    // Transform the role ID to a role string
    const user: User = {
      id: userData.id.toString(), // Ensure ID is a string if necessary
      email: userData.email,
      name: userData.full_name, // Adjust according to your response structure
      role: mapRoleIdToRole(userData.role_id), // Transform role ID to role string
      createdAt: new Date().toISOString(), // Adjust according to your response structure
    };

    return user;
  },

register: async (userData: UserRegistration): Promise<User> => {
  const payload = {
    full_name: userData.name,
    email: userData.email,
    password_hash: userData.password, // Ensure this is sent as plain text if the server expects it
    role_id: userData.role === 'admin' ? 2 : 1, // Transform role to role_id
  };

  const response = await axios.post(`${config.api.auth.register}`, payload);
  console.log('Registration response:', response.data);
  return response.data;
},

  getCurrentUser: async (): Promise<User | null> => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
};
