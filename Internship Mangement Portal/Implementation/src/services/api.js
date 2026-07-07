import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from './tokenStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

let clerkTokenGetter = null;
let isRefreshing = false;
let refreshQueue = [];

export function setClerkTokenGetter(getter) {
  clerkTokenGetter = getter;
}

api.interceptors.request.use(async (config) => {
  if (config.headers.Authorization) {
    return config;
  }

  const jwt = getAccessToken();
  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
    return config;
  }

  if (!clerkTokenGetter) {
    return config;
  }

  try {
    const token = await clerkTokenGetter();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Clerk session not ready — do not attach a token
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (!original || error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken || original.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${api.defaults.baseURL}/auth/refresh`,
        { refreshToken },
      );
      const newAccess = data.data.accessToken;
      setTokens({
        accessToken: newAccess,
        refreshToken: data.data.refreshToken,
      });
      refreshQueue.forEach((pending) => pending.resolve(newAccess));
      refreshQueue = [];
      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    } catch (refreshError) {
      refreshQueue.forEach((pending) => pending.reject(refreshError));
      refreshQueue = [];
      clearTokens();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
