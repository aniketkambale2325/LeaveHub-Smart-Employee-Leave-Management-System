import axios from 'axios';
import { getToken, clearAuth } from '../utils/tokenUtils';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    const errorMsg = err.response?.data?.message || err.message || 'API error';
    console.error('API Error:', { 
      status: err.response?.status, 
      message: errorMsg,
      error: err 
    });
    
    if (err.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }
    // Dispatch a global event for non-auth API errors so UI can show toasts
    try {
      window.dispatchEvent(new CustomEvent('api-error', { detail: { message: errorMsg, status: err.response?.status } }));
    } catch (e) {
      // ignore
    }
    return Promise.reject(err);
  }
);

export default api;