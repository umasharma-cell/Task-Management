import api from './api';
import { ApiResponse, Task, CreateTaskInput, UpdateTaskInput } from '@/types';

interface TaskListParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export const taskApi = {
  getAll: async (params: TaskListParams = {}) => {
    const { data } = await api.get<ApiResponse<Task[]>>('/tasks', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return data;
  },

  create: async (input: CreateTaskInput) => {
    const { data } = await api.post<ApiResponse<Task>>('/tasks', input);
    return data;
  },

  update: async (id: string, input: UpdateTaskInput) => {
    const { data } = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, input);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse>(`/tasks/${id}`);
    return data;
  },

  toggleStatus: async (id: string) => {
    const { data } = await api.patch<ApiResponse<Task>>(`/tasks/${id}/toggle`);
    return data;
  },
};
