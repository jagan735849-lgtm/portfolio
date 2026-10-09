import api from './api';
import { IApiResponse, IContactMessage } from '../types';

export const contactService = {
  submitMessage: async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    honeypot?: string;
  }) => {
    const res = await api.post<IApiResponse<{ id: string }>>('/contact', data);
    return res.data;
  },

  getMessages: async (params?: { page?: number; limit?: number; isRead?: boolean; search?: string }) => {
    const res = await api.get<IApiResponse<IContactMessage[]>>('/admin/messages', { params });
    return res.data;
  },

  updateMessageStatus: async (id: string, isRead: boolean) => {
    const res = await api.patch<IApiResponse<IContactMessage>>(`/admin/messages/${id}`, { isRead });
    return res.data;
  },

  deleteMessage: async (id: string) => {
    const res = await api.delete<IApiResponse<{ id: string }>>(`/admin/messages/${id}`);
    return res.data;
  },

  getDashboardStats: async () => {
    const res = await api.get<IApiResponse<any>>('/admin/stats');
    return res.data;
  },
};
