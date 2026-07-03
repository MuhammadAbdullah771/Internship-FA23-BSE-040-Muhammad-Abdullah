import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './tokenStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let refreshQueue = [];

function processQueue(error, token = null) {
  refreshQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(token);
  });
  refreshQueue = [];
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthRoute = original?.url?.includes('/auth/login')
      || original?.url?.includes('/auth/register')
      || original?.url?.includes('/auth/refresh');

    if (error.response?.status !== 401 || original._retry || isAuthRoute) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
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
        { headers: { 'Content-Type': 'application/json' } },
      );
      const { accessToken, refreshToken: newRefreshToken } = data.data;
      setTokens({ accessToken, refreshToken: newRefreshToken });
      processQueue(null, accessToken);
      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearTokens();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
