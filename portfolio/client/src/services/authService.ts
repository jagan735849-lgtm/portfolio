import api from './api';
import { IApiResponse, IUser } from '../types';

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post<IApiResponse<{ token: string; user: IUser }>>('/auth/login', credentials);
    return res.data;
  },

  logout: async () => {
    const res = await api.post<IApiResponse<null>>('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return res.data;
  },

  getMe: async () => {
    const res = await api.get<IApiResponse<IUser>>('/auth/me');
    return res.data;
  },
};
