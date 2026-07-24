import api from './axios';

export const getMyPortfolio = () => api.get('/portfolio/me');

export const updateMyPortfolio = (payload) =>
  api.put('/portfolio/me', payload);

export const saveSectionVisibility = (sectionVisibility) =>
  api.put('/portfolio/me/visibility', { sectionVisibility });

export const saveProjectOrder = (projectOrder) =>
  api.put('/portfolio/me/project-order', { projectOrder });

export const saveTheme = (payload) => api.put('/portfolio/me/theme', payload);

export const saveCustomization = (payload) =>
  api.put('/portfolio/me/customization', payload);

export const checkUsernameAvailability = (username) =>
  api.get('/portfolio/check-username', { params: { username } });

export const setMyUsername = (username) =>
  api.put('/portfolio/me/username', { username });

export const generateMyUsername = (seed) =>
  api.post('/portfolio/me/username/generate', seed ? { seed } : {});

export const getPublicPortfolio = (username) =>
  api.get(`/portfolio/public/${encodeURIComponent(username)}`);

export const getPublicIntern = (username) =>
  api.get(`/portfolio/public/${encodeURIComponent(username)}/profile`);

export const getPublicProjects = (username) =>
  api.get(`/portfolio/public/${encodeURIComponent(username)}/projects`);

export const getPublicProject = (username, projectId) =>
  api.get(
    `/portfolio/public/${encodeURIComponent(username)}/projects/${projectId}`
  );
