 export type Role = 'user' | 'admin';
//export type Role = 'Standard' | 'Admin';

export interface User {
  id: string | number;
  email: string;
  name: string;
  full_name?: string; // Optional for compatibility with some APIs
  role: Role;
  createdAt: string;
}

export type UserCredentials = {
  email: string;
  password: string;
};

export type UserRegistration = UserCredentials & {
  name: string;
  role: Role;
};

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'completed' | 'closed' | 'To Do' | 'In Progress' | 'Completed' | 'Closed' | 'Open';

export interface StatusChange {
  id: string;
  taskId: string;
  previousStatus: Status;
  newStatus: Status;
  changedBy: string;
  changedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  projectId?: string;
  createdBy: string;
  assignedTo?: string; // Add this field for the assigned user ID
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusChange[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}