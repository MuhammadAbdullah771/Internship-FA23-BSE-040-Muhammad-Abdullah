import api from './axios';

export const getAccount = () => api.get('/account');

export const updateAccount = (payload) => api.put('/account', payload);

export const updatePassword = (payload) =>
  api.put('/account/password', payload);

export const deleteAccount = (confirmation) =>
  api.delete('/account', { data: { confirmation } });
