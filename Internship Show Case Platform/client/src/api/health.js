import api from './axios';

export const checkHealth = () => api.get('/health');
