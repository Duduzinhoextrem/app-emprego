import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';
import type { User, LoginCredentials, RegisterData } from '../types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    /**
     * Carrega os dados do usuário ao abrir o app.
     * 
     * Se existe um token salvo, tenta buscar o perfil do usuário.
     * Se o token estiver inválido/expirado, limpa os tokens e volta para login.
     */
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        // Se tem token, busca os dados do usuário
        const userData = await authAPI.getProfile();
        setUser(userData);
      }
    } catch (error: any) {
      // Se deu erro de autenticação (401 ou 400 com HTML), limpa os tokens
      // Isso força o usuário a fazer login novamente
      if (error.response?.status === 401 || 
          (error.response?.status === 400 && 
           typeof error.response?.data === 'string' && 
           error.response.data.includes('<!DOCTYPE html>'))) {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
      }
      // Só registra erros inesperados (não de autenticação)
      if (error.response?.status !== 401 && error.response?.status !== 400) {
        console.log('Erro ao carregar dados salvos:', error);
      }
    } finally {
      setLoading(false);
    }
  }

  async function login(credentials: LoginCredentials) {
    const tokens = await authAPI.login(credentials);
    await AsyncStorage.setItem('accessToken', tokens.access);
    await AsyncStorage.setItem('refreshToken', tokens.refresh);
    const userData = await authAPI.getProfile();
    setUser(userData);
  }

  async function register(data: RegisterData) {
    const tokens = await authAPI.register(data);
    await AsyncStorage.setItem('accessToken', tokens.access);
    await AsyncStorage.setItem('refreshToken', tokens.refresh);
    const userData = await authAPI.getProfile();
    setUser(userData);
  }

  async function logout() {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
