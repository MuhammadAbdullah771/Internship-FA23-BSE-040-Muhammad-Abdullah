import api from './api';

export async function fetchCurrentUser() {
  const { data } = await api.get('/auth/me');
  return {
    id: data.data.user.id,
    email: data.data.user.email,
    name: data.data.user.name,
    role: data.data.user.role,
    avatar: data.data.user.avatar,
    portalAccessStatus: data.data.user.portalAccessStatus,
    portalAccess: data.data.user.portalAccess,
  };
}
