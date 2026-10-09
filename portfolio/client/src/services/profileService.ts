import api from './api';
import { IApiResponse, IProfile } from '../types';

export const profileService = {
  getProfile: async () => {
    const res = await api.get<IApiResponse<IProfile>>('/profile');
    return res.data;
  },

  updateProfile: async (data: Partial<IProfile>) => {
    const res = await api.put<IApiResponse<IProfile>>('/profile', data);
    return res.data;
  },
};
