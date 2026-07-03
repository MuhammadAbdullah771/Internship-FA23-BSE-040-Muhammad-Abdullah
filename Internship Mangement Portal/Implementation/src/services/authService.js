import api from './api';
import { clearTokens, setTokens } from './tokenStorage';

function mapUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  };
}

function extractError(error) {
  const data = error.response?.data;
  if (data?.message) return data.message;
  if (data?.errors?.[0]?.message) return data.errors[0].message;
  if (!error.response) return 'Unable to reach the server. Is the API running?';
  return 'Something went wrong. Please try again.';
}

export async function registerStudent(payload) {
  try {
    const { data } = await api.post('/auth/register', payload);
    setTokens(data.data);
    return { success: true, user: mapUser(data.data.user) };
  } catch (error) {
    return { success: false, error: extractError(error) };
  }
}

export async function loginUser(payload) {
  try {
    const { data } = await api.post('/auth/login', payload);
    setTokens(data.data);
    return { success: true, user: mapUser(data.data.user) };
  } catch (error) {
    return { success: false, error: extractError(error) };
  }
}

export async function fetchCurrentUser() {
  const { data } = await api.get('/auth/me');
  return mapUser(data.data.user);
}

export async function refreshSession() {
  const refreshToken = localStorage.getItem('internhub_refresh_token');
  if (!refreshToken) {
    throw new Error('No refresh token');
  }
  const { data } = await api.post('/auth/refresh', { refreshToken });
  setTokens(data.data);
  return mapUser(data.data.user);
}

export async function logoutUser() {
  const refreshToken = localStorage.getItem('internhub_refresh_token');
  try {
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken });
    }
  } finally {
    clearTokens();
  }
}

export async function requestPasswordReset(email) {
  try {
    const { data } = await api.post('/auth/forgot-password', { email });
    return { success: true, message: data.data.message };
  } catch (error) {
    return { success: false, error: extractError(error) };
  }
}
