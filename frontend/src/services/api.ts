import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LoginCredentials, RegisterData, AuthTokens, User, Task } from '../types';
import { getApiUrl } from './apiConfig';

let API_URL = 'http://SEU_IP_LOCAL:8000/api';
let apiUrlInitialized = false;

async function initializeApiUrl() {
  if (!apiUrlInitialized) {
    try {
      API_URL = await getApiUrl();
      apiUrlInitialized = true;
      console.log(`🌐 API URL configurada: ${API_URL}`);
    } catch (error) {
      console.error('Erro ao inicializar URL da API:', error);
    }
  }
}

initializeApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
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
  (error) => {
    console.error('Erro ao preparar requisição:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isHtmlResponse = error.response?.data && 
      typeof error.response.data === 'string' && 
      error.response.data.includes('<!DOCTYPE html>');
    
    if (!originalRequest._retry && error.response?.status === 401) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          await AsyncStorage.setItem('accessToken', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        return Promise.reject(error);
      }
    }
    
    if (error.response?.status === 400 && isHtmlResponse) {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
    }
    
    if (!error.response && error.message === 'Network Error') {
      console.error('❌ ERRO DE REDE: Não foi possível conectar ao backend');
      console.error('📋 Verifique:');
      console.error(`   1. Backend está rodando? Teste: ${API_URL.replace('/api', '')}/docs/`);
      console.error('   2. IP está correto no apiConfig.ts?');
      console.error('   3. Backend rodando em 0.0.0.0:8000?');
      console.error('   4. Celular e PC na mesma rede Wi-Fi?');
      console.error('   5. Firewall bloqueando porta 8000?');
      
      error.userMessage = 'Erro de conexão. Verifique se o servidor está rodando e se o IP está correto.';
      return Promise.reject(error);
    }
    
    const isAuthEndpoint = error.config?.url?.includes('/auth/login/') || 
                           error.config?.url?.includes('/auth/register/') ||
                           error.config?.url?.includes('/auth/token/refresh/');
    
    const isExpectedAuthError = isAuthEndpoint && 
                                (error.response?.status === 401 || 
                                 error.response?.status === 400);
    
    if (!isHtmlResponse && !isExpectedAuthError) {
      console.error('Erro na resposta da API:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }
    
    return Promise.reject(error);
  }
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
  
  getUsers: async (): Promise<User[]> => {
    const { data } = await api.get('/auth/users/');
    return Array.isArray(data) ? data : (data.results || []);
  },
  
  requestPasswordReset: async (email: string): Promise<{ detail: string; token?: string; expires_at?: string }> => {
    const { data } = await api.post('/auth/request-password-reset/', { email });
    return data;
  },
  
  resetPassword: async (token: string, newPassword: string, newPasswordConfirm: string): Promise<{ detail: string }> => {
    const { data } = await api.post('/auth/reset-password/', {
      token,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    });
    return data;
  },
  
  deleteUser: async (userId: number): Promise<{ detail: string }> => {
    const { data } = await api.delete(`/auth/users/${userId}/`);
    return data;
  },
};

export const tasksAPI = {
  getTasks: async (filters?: { status?: string; created_at?: string; created_at_gte?: string; created_at_lte?: string }): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.created_at) params.append('created_at', filters.created_at);
      if (filters.created_at_gte) params.append('created_at_gte', filters.created_at_gte);
      if (filters.created_at_lte) params.append('created_at_lte', filters.created_at_lte);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/tasks/?${queryString}` : '/tasks/';
    const { data } = await api.get(url);
    
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
