import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LoginCredentials, RegisterData, AuthTokens, User, Task } from '../types';

const API_URL = 'http://192.168.15.9:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const { data } = await api.post('/auth/login/', credentials);
    return data;
  },
  
  register: async (userData: RegisterData): Promise<AuthTokens> => {
    const { data } = await api.post('/auth/register/', userData);
    return data;
  },
  
  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/auth/profile/');
    return data;
  },
};

export const tasksAPI = {
  getTasks: async (): Promise<Task[]> => {
    const { data } = await api.get('/tasks/');
    // Se a API retornar paginação, extrair o array results
    return Array.isArray(data) ? data : (data.results || []);
  },
  
  createTask: async (task: Partial<Task>): Promise<Task> => {
    const { data } = await api.post('/tasks/', task);
    return data;
  },
  
  updateTask: async (id: number, task: Partial<Task>): Promise<Task> => {
    const { data } = await api.patch(`/tasks/${id}/`, task);
    return data;
  },
  
  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}/`);
  },
  
  completeTask: async (id: number): Promise<Task> => {
    const { data} = await api.post(`/tasks/${id}/complete/`);
    return data;
  },
  
  reopenTask: async (id: number): Promise<Task> => {
    const { data } = await api.post(`/tasks/${id}/reopen/`);
    return data;
  },
};

export default api;
