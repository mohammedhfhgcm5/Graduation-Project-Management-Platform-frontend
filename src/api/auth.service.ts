import { api } from '@/api/api';
import type { AuthResponse, User, UserRole } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
}

export const authService = {
  async login(payload: LoginPayload) {
    const response = await api.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },

  async register(payload: RegisterPayload) {
    const response = await api.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  async createUser(payload: RegisterPayload) {
    const response = await api.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  async getUsers(role?: UserRole) {
    const response = await api.get<User[]>('/auth/users', {
      params: role ? { role } : undefined,
    });
    return response.data;
  },
};
