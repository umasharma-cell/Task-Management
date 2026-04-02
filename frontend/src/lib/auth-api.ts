import api from './api';
import { ApiResponse, User, LoginCredentials, RegisterCredentials } from '@/types';

interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authApi = {
  register: async (credentials: RegisterCredentials) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', credentials);
    return data;
  },

  login: async (credentials: LoginCredentials) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return data;
  },

  logout: async () => {
    const { data } = await api.post<ApiResponse>('/auth/logout');
    return data;
  },

  refresh: async () => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/refresh');
    return data;
  },
};
