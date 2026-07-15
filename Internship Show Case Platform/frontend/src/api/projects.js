import api from './axios';

export const getMyProjects = () => api.get('/projects');

export const getProject = (id) => api.get(`/projects/${id}`);

export const createProject = (payload) => api.post('/projects', payload);

export const updateProject = (id, payload) =>
  api.put(`/projects/${id}`, payload);

export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const uploadProjectImages = (id, files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('images', file);
  });
  return api.post(`/projects/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
