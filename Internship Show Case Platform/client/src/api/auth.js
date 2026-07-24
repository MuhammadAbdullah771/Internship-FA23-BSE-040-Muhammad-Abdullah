import api from './axios';

export const syncCurrentUser = () => api.post('/auth/sync', {});

export const getCurrentUser = () => api.get('/auth/me');
