import api from './axios';

export const getDashboardStats = () => api.get('/dashboard/stats');

export const getDashboardAnalytics = (days = 14) =>
  api.get('/dashboard/analytics', { params: { days } });
