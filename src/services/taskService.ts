import { Task, Priority, Status, StatusChange } from '../types';
import axios from 'axios';
import { config } from '../config/config';

export const taskService = {
  getAllTasks: async (): Promise<Task[]> => {
    try {
      const response = await axios.get(`${config.api.tasks.all}`);
      // Map API response keys to your Task type keys if necessary
      return response.data.map((t: any) => ({
        id: t.id.toString(),
        title: t.title,
        description: t.description,
        dueDate: t.due_date,
        priority: t.priority.toLowerCase(),
        status: t.status,
        createdBy: t.created_by,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
        assignedTo: t.closed_by,
        projectId: t.project_id,
        statusHistory: [], // assuming no status history from API for now
      }));
    } catch (error: any) {
      throw new Error(`Failed to fetch tasks: ${error.response?.data?.detail || error.message}`);
    }
  },

  getTaskById: async (id: string): Promise<Task> => {
    try {
      const response = await axios.get(`${config.api.tasks.byId(id.toString())}`);
      const t = response.data;
      return {
        id: t.id.toString(),
        title: t.title,
        description: t.description,
        dueDate: t.due_date,
        priority: t.priority.toLowerCase(),
        status: t.status,
        createdBy: t.created_by,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
        assignedTo: t.closed_by,
        projectId: t.project_id,
        statusHistory: [],
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch task: ${error.response?.data?.detail || error.message}`);
    }
  },

  createTask: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Promise<Task> => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : { id: 1 };

  const payload = {
    title: taskData.title,
    description: taskData.description,
    project_id: taskData.projectId,
    created_by: user.id,
    due_date: taskData.dueDate,
    priority: taskData.priority,
    status: taskData.status,
    closed_by: taskData.assignedTo ?? null,
  };

  try {
    const response = await axios.post(`${config.api.tasks.create}`, payload);
    console.log('Task created successfully:', response.data);
    const createdTask = response.data;

    return {
      id: createdTask.id,
      title: createdTask.title,
      description: createdTask.description,
      dueDate: createdTask.due_date,
      priority: createdTask.priority?.toLowerCase(),
      status: createdTask.status?.toLowerCase(),
      createdBy: createdTask.created_by,
      createdAt: createdTask.created_at,
      updatedAt: createdTask.updated_at,
      assignedTo: createdTask.closed_by,
      projectId: createdTask.project_id,
      statusHistory: [],
    };
  } catch (error: any) {
    throw new Error(`Failed to create task: ${error.response?.data?.detail || error.message}`);
  }
},

  updateTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    try {
      // Prepare payload adapting keys to backend API
      const payload = {
        title: taskData.title,
        description: taskData.description,
        project_id: taskData.projectId,
        due_date: taskData.dueDate,
        priority: taskData.priority?.toUpperCase(), // API expects upper case?
        status: taskData.status,
        closed_by: taskData.assignedTo ?? null,
      };

      const response = await axios.put(`${config.api.tasks.update(id.toString())}`, payload);

      const t = response.data;
      return {
        id: t.id.toString(),
        title: t.title,
        description: t.description,
        dueDate: t.due_date,
        priority: t.priority.toLowerCase(),
        status: t.status,
        createdBy: t.created_by,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
        assignedTo: t.closed_by,
        projectId: t.project_id,
        statusHistory: [],
      };
    } catch (error: any) {
      throw new Error(`Failed to update task: ${error.response?.data?.detail || error.message}`);
    }
  },

  deleteTask: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${config.api.tasks.delete(id.toString())}`);
    } catch (error: any) {
      throw new Error(`Failed to delete task: ${error.response?.data?.detail || error.message}`);
    }
  },
};
