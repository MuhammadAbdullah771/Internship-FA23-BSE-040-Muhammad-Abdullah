import axios from 'axios';

/**
 * Prefer Vite proxy (/api) in the browser so requests stay same-origin.
 * Absolute VITE_API_URL is still supported when explicitly set to a full URL.
 */
const envUrl = import.meta.env.VITE_API_URL;
const baseURL =
  envUrl && /^https?:\/\//i.test(envUrl) ? envUrl : envUrl || '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

let tokenGetter = null;

/**
 * Register a function that returns a Clerk session JWT.
 * Called from AuthProvider so axios can authorize API requests.
 */
export const setAuthTokenGetter = (getter) => {
  tokenGetter = getter;
};

api.interceptors.request.use(
  async (config) => {
    if (tokenGetter) {
      try {
        const token = await tokenGetter();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // Don't block public API calls if token retrieval fails
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    if (!error.response && error.message === 'Network Error') {
      message =
        'Cannot reach the API. Start the backend with "npm run dev:backend" (port 5000), then try again.';
    }

    if (error.response?.status === 502 || error.response?.status === 503) {
      message =
        'API is restarting or unavailable. Please wait a second and try again.';
    }

    return Promise.reject({
      ...error,
      message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api;
