import apiClient from './api';

export const authService = {
  requestOtp: (mobile: string) =>
    apiClient.post('/auth/request-otp', { mobile }),

  verifyOtp: (mobile: string, otp: string) =>
    apiClient.post('/auth/verify-otp', { mobile, otp }),

  getMe: () =>
    apiClient.get('/auth/me'),

  logout: () =>
    apiClient.post('/auth/logout'),
};
