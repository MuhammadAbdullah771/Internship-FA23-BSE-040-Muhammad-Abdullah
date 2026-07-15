import api from './axios';

export const getMyProfile = () => api.get('/profiles/me');

export const createProfile = (payload) => api.post('/profiles', payload);

export const updateProfile = (payload) => api.put('/profiles/me', payload);

export const uploadProfileImage = (file) => {
  const formData = new FormData();
  formData.append('profileImage', file);
  return api.post('/profiles/me/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const addSkill = (skill) => api.post('/profiles/me/skills', { skill });

export const removeSkill = (skill) =>
  api.delete(`/profiles/me/skills/${encodeURIComponent(skill)}`);

export const updateSocialLinks = (payload) =>
  api.put('/profiles/me/social', payload);
