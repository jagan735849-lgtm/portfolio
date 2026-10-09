export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const BACKEND_URL = API_BASE_URL.replace('/api', '');
