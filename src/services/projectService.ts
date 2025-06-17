// services/projectService.ts
import axios from 'axios';
import { Project } from '../types';
import { config } from '../config/config';


export const projectService = {
  getAllProjects: async (): Promise<Project[]> => {
    const response = await axios.get(config.api.projectService.getAllProject);
    return response.data.map((project: any) => ({
      id: project.id.toString(),
      name: project.name,
      description: project.description,
      createdBy: project.created_by.toString(),
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    }));
  },

  getProjectById: async (id: string): Promise<Project> => {
    const response = await axios.get(`${config.api.projectService.getPorjectById(Number(id))}`);
    console.log('Project response:', response.data);
    const project = response.data;
    return {
      id: project.id.toString(),
      name: project.name,
      description: project.description,
      createdBy: project.created_by.toString(),
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    };
  },

  createProject: async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<Project> => {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : { id: 'anonymous' };

    const response = await axios.post(config.api.projectService.createProject, {
      ...projectData,
      created_by: user.id,
    });

    const createdProject = response.data;
    return {
      id: createdProject.id.toString(),
      name: createdProject.name,
      description: createdProject.description,
      createdBy: createdProject.created_by.toString(),
      createdAt: createdProject.created_at,
      updatedAt: createdProject.updated_at,
    };
  },

  updateProject: async (id: string, projectData: Partial<Project>): Promise<Project> => {
    const response = await axios.put(`${config.api.projectService.updateProject(Number(id))}`, projectData);
    const updatedProject = response.data;
    return {
      id: updatedProject.id.toString(),
      name: updatedProject.name,
      description: updatedProject.description,
      createdBy: updatedProject.created_by.toString(),
      createdAt: updatedProject.created_at,
      updatedAt: updatedProject.updated_at,
    };
  },

  deleteProject: async (id: string): Promise<void> => {
  await axios.delete(config.api.projectService.deleteProject(Number(id)));
}
};
