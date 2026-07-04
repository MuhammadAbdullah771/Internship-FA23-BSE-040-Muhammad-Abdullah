import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

let clerkTokenGetter = null;

export function setClerkTokenGetter(getter) {
  clerkTokenGetter = getter;
}

api.interceptors.request.use(async (config) => {
  if (!clerkTokenGetter) {
    return config;
  }

  try {
    const token = await clerkTokenGetter();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Clerk session not ready
  }

  return config;
});

export default api;
