import api from './api';
import { IApiResponse, IEducation } from '../types';

export const educationService = {
  getEducations: async () => {
    const res = await api.get<IApiResponse<IEducation[]>>('/education');
    return res.data;
  },

  createEducation: async (data: Partial<IEducation>) => {
    const res = await api.post<IApiResponse<IEducation>>('/admin/education', data);
    return res.data;
  },

  updateEducation: async (id: string, data: Partial<IEducation>) => {
    const res = await api.put<IApiResponse<IEducation>>(`/admin/education/${id}`, data);
    return res.data;
  },

  deleteEducation: async (id: string) => {
    const res = await api.delete<IApiResponse<{ id: string }>>(`/admin/education/${id}`);
    return res.data;
  },
};
