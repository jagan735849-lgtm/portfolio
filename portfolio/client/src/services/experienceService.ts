import api from './api';
import { IApiResponse, IExperience } from '../types';

export const experienceService = {
  getExperiences: async () => {
    const res = await api.get<IApiResponse<IExperience[]>>('/experience');
    return res.data;
  },

  createExperience: async (data: Partial<IExperience>) => {
    const res = await api.post<IApiResponse<IExperience>>('/admin/experience', data);
    return res.data;
  },

  updateExperience: async (id: string, data: Partial<IExperience>) => {
    const res = await api.put<IApiResponse<IExperience>>(`/admin/experience/${id}`, data);
    return res.data;
  },

  deleteExperience: async (id: string) => {
    const res = await api.delete<IApiResponse<{ id: string }>>(`/admin/experience/${id}`);
    return res.data;
  },
};
