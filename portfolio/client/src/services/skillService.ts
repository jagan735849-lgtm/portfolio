import api from './api';
import { IApiResponse, ISkill } from '../types';

export const skillService = {
  getSkills: async (params?: { category?: string; grouped?: boolean }) => {
    const res = await api.get<IApiResponse<ISkill[]>>('/skills', { params });
    return res.data;
  },

  createSkill: async (data: Partial<ISkill>) => {
    const res = await api.post<IApiResponse<ISkill>>('/admin/skills', data);
    return res.data;
  },

  updateSkill: async (id: string, data: Partial<ISkill>) => {
    const res = await api.put<IApiResponse<ISkill>>(`/admin/skills/${id}`, data);
    return res.data;
  },

  deleteSkill: async (id: string) => {
    const res = await api.delete<IApiResponse<{ id: string }>>(`/admin/skills/${id}`);
    return res.data;
  },
};
