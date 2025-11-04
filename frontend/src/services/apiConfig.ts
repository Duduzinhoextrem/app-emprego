import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_CONFIG_STORAGE_KEY = '@todoapp:api_config';

export interface ApiConfig {
  baseUrl: string;
  ip: string;
}

// IP padrão - troque pelo IP da sua máquina (descubra com ipconfig ou ifconfig)
const DEFAULT_IP = '192.168.1.100';

// Salva o IP no AsyncStorage
async function saveApiConfig(ip: string): Promise<void> {
  try {
    const config: ApiConfig = {
      baseUrl: `http://${ip}:8000/api`,
      ip,
    };
    await AsyncStorage.setItem(API_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Erro ao salvar configuração da API:', error);
  }
}

// Carrega o IP salvo anteriormente
export async function getApiConfig(): Promise<ApiConfig | null> {
  try {
    const configStr = await AsyncStorage.getItem(API_CONFIG_STORAGE_KEY);
    if (configStr) {
      return JSON.parse(configStr);
    }
  } catch (error) {
    console.error('Erro ao carregar configuração da API:', error);
  }
  return null;
}

// Retorna a URL da API (usa IP salvo ou o padrão)
export async function getApiUrl(): Promise<string> {
  const savedConfig = await getApiConfig();
  if (savedConfig) {
    return savedConfig.baseUrl;
  }
  return `http://${DEFAULT_IP}:8000/api`;
}

// Testa se o servidor está acessível no IP informado
async function testConnection(ip: string, timeout: number = 3000): Promise<boolean> {
  try {
    const response = await axios.get(`http://${ip}:8000/api/docs/`, {
      timeout,
      validateStatus: () => true,
    });
    return response.status < 500;
  } catch {
    return false;
  }
}

// Define o IP do servidor (valida formato e testa conexão)
export async function setServerIP(ip: string): Promise<void> {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) {
    throw new Error('Formato de IP inválido');
  }
  
  const isWorking = await testConnection(ip, 3000);
  if (!isWorking) {
    throw new Error('Não foi possível conectar ao servidor neste IP');
  }
  
  await saveApiConfig(ip);
  console.log(`✅ IP configurado: ${ip}`);
}

// Limpa a configuração salva
export async function clearApiConfig(): Promise<void> {
  await AsyncStorage.removeItem(API_CONFIG_STORAGE_KEY);
}
