import axios from 'axios';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:8000';
const API = `${API_BASE}/api/v1`;

export const apiClient = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('farmer');
        if (!window.location.pathname.includes('/farmer/login')) {
          window.location.href = '/farmer/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
