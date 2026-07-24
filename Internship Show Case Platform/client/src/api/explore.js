import api from './axios';

export const getExploreMeta = () => api.get('/explore/meta');

export const searchProjects = (params = {}) =>
  api.get('/explore/projects', { params });

export const getExploreProject = (id) => api.get(`/explore/projects/${id}`);

export const searchInterns = (params = {}) =>
  api.get('/explore/interns', { params });
