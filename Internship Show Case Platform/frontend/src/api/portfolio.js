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
