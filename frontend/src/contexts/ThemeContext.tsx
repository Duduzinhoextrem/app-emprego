import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  // Backgrounds
  background: string;
  surface: string;
  card: string;
  
  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  
  // Borders and dividers
  border: string;
  divider: string;
  
  // Primary colors
  primary: string;
  primaryText: string;
  
  // Status colors
  success: string;
  error: string;
  warning: string;
  
  // Input
  inputBackground: string;
  inputBorder: string;
  
  // Button variants
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonSecondary: string;
  buttonSecondaryText: string;
  buttonDanger: string;
  buttonDangerText: string;
}

const lightTheme: ThemeColors = {
  background: '#f5f5f5',
  surface: '#ffffff',
  card: '#ffffff',
  text: '#333333',
  textSecondary: '#666666',
  textMuted: '#999999',
  border: '#e0e0e0',
  divider: '#e0e0e0',
  primary: '#007AFF',
  primaryText: '#ffffff',
  success: '#4CAF50',
  error: '#d32f2f',
  warning: '#FF9800',
  inputBackground: '#ffffff',
  inputBorder: '#e0e0e0',
  buttonPrimary: '#007AFF',
  buttonPrimaryText: '#ffffff',
  buttonSecondary: '#ffffff',
  buttonSecondaryText: '#007AFF',
  buttonDanger: '#ffebee',
  buttonDangerText: '#d32f2f',
};

const darkTheme: ThemeColors = {
  background: '#121212',
  surface: '#1e1e1e',
  card: '#2d2d2d',
  text: '#ffffff',
  textSecondary: '#b3b3b3',
  textMuted: '#808080',
  border: '#404040',
  divider: '#333333',
  primary: '#0a84ff',
  primaryText: '#ffffff',
  success: '#66BB6A',
  error: '#ef5350',
  warning: '#FFB74D',
  inputBackground: '#2d2d2d',
  inputBorder: '#404040',
  buttonPrimary: '#0a84ff',
  buttonPrimaryText: '#ffffff',
  buttonSecondary: '#2d2d2d',
  buttonSecondaryText: '#0a84ff',
  buttonDanger: '#4a2c2c',
  buttonDangerText: '#ef5350',
};

interface ThemeContextData {
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => Promise<void>;
  setTheme: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

const THEME_STORAGE_KEY = '@todoapp:theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredTheme();
  }, []);

  async function loadStoredTheme() {
    try {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setThemeState(storedTheme);
      }
    } catch (error) {
      console.log('Erro ao carregar tema salvo:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleTheme() {
    const newTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
    await setTheme(newTheme);
  }

  async function setTheme(mode: ThemeMode) {
    try {
      setThemeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.log('Erro ao salvar tema:', error);
    }
  }

  const colors = theme === 'dark' ? darkTheme : lightTheme;

  if (loading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  return useContext(ThemeContext);
}

