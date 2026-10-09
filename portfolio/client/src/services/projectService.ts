import api from './api';
import { IApiResponse, IProject } from '../types';

export const projectService = {
  getProjects: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    featured?: boolean;
  }) => {
    const res = await api.get<IApiResponse<IProject[]>>('/projects', { params });
    return res.data;
  },

  getProjectById: async (id: string) => {
    const res = await api.get<IApiResponse<IProject>>(`/projects/${id}`);
    return res.data;
  },

  createProject: async (data: Partial<IProject>) => {
    const res = await api.post<IApiResponse<IProject>>('/admin/projects', data);
    return res.data;
  },

  updateProject: async (id: string, data: Partial<IProject>) => {
    const res = await api.put<IApiResponse<IProject>>(`/admin/projects/${id}`, data);
    return res.data;
  },

  deleteProject: async (id: string) => {
    const res = await api.delete<IApiResponse<{ id: string }>>(`/admin/projects/${id}`);
    return res.data;
  },
};
