import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Store reference to the Redux store (set by the app)
let reduxStore = null;

export const setReduxStore = (store) => {
  reduxStore = store;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        if (data.data?.accessToken) {
          localStorage.setItem('token', data.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Token refresh failed - clear all auth state
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Clear Redux state if store is available
        if (reduxStore) {
          const { default: cartSlice } = await import('../redux/cartSlice');
          const { logout } = await import('../redux/authSlice');
          reduxStore.dispatch(logout());
          reduxStore.dispatch(cartSlice.clearCart());
        }

        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;