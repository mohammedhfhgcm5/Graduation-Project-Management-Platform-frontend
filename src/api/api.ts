import axios, { type AxiosError } from 'axios';

import { useAuthStore } from '@/store/zustand/authStore';
import { useNotificationStore } from '@/store/zustand/notificationStore';

interface ApiErrorResponse {
  message?: string | string[];
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      const { token, logout } = useAuthStore.getState();

      if (token) {
        logout();
        useNotificationStore.getState().clearNotifications();

        if (window.location.pathname !== '/login') {
          window.location.assign('/login');
        }
      }
    }

    return Promise.reject(error);
  },
);
