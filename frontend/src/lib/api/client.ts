import axios from 'axios';

// Use Vite environment variable or default to local FastAPI server
const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:8000';
const API = `${API_BASE}/api/v1`;

const api = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// JWT Interceptor — attach token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('farmer');
        // Do not force reload if already on login page
        if (!window.location.pathname.includes('/farmer/login')) {
          window.location.href = '/farmer/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth Services ───────────────────────────────────────────
export const requestOtp = (mobile: string) =>
  api.post('/auth/request-otp', { mobile });

export const verifyOtp = (mobile: string, otp: string) =>
  api.post('/auth/verify-otp', { mobile, otp });

export const getMe = () =>
  api.get('/auth/me');

export const logoutApi = () =>
  api.post('/auth/logout');

// ── Fields Services ─────────────────────────────────────────
export const getMyFields = () =>
  api.get('/fields');

export const getFieldById = (fieldId: number | string) =>
  api.get(`/fields/${fieldId}`);

export const searchFieldByGat = (gatNo: string, villageId?: number) =>
  api.get('/fields/search', { params: { gat_no: gatNo, village_id: villageId } });

// ── Soil Services ───────────────────────────────────────────
export const getFieldSoil = (fieldId: number | string) =>
  api.get(`/fields/${fieldId}/soil`);

export const getFieldSoilSummary = (fieldId: number | string) =>
  api.get(`/fields/${fieldId}/soil/summary`);

export const getFieldSoilHistory = (fieldId: number | string) =>
  api.get(`/fields/${fieldId}/soil/history`);

// ── Reports Services ────────────────────────────────────────
export const getReports = () =>
  api.get('/reports');

export const getReportById = (reportId: string | number) =>
  api.get(`/reports/${reportId}`);

export const getReportPdfUrl = (reportId: string | number) =>
  `${API}/reports/${reportId}/pdf`;

// ── Health Check ────────────────────────────────────────────
export const healthCheck = () =>
  axios.get(`${API_BASE}/health`);

export default api;
