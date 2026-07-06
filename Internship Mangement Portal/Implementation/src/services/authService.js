import api from './api';
import { setTokens, clearTokens, getRefreshToken } from './tokenStorage';

export function mapUserDto(data) {
  return {
    id: data.id,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    name: data.name,
    role: data.role,
    avatar: data.avatar,
    portalAccessStatus: data.portalAccessStatus,
    portalAccess: data.portalAccess,
  };
}

export async function updateProfile(payload) {
  try {
    const { data } = await api.patch('/auth/me', payload);
    return { success: true, user: mapUserDto(data.data.user) };
  } catch (error) {
    const msg = error.response?.data?.message || 'Failed to update profile';
    return { success: false, error: msg };
  }
}

export async function fetchCurrentUser() {
  const { data } = await api.get('/auth/me');
  return mapUserDto(data.data.user);
}

export async function loginWithPassword({ email, password, expectedRole }) {
  const { data } = await api.post('/auth/login', { email, password, expectedRole });
  setTokens({
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken,
  });
  return {
    user: mapUserDto(data.data.user),
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken,
  };
}

export async function refreshStoredSession() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  const { data } = await api.post('/auth/refresh', { refreshToken });
  setTokens({
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken,
  });
  return mapUserDto(data.data.user);
}

export async function logoutSession() {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    try {
      await api.post('/auth/logout', { refreshToken });
    } catch {
      // Session may already be invalid
    }
  }
  clearTokens();
}
