/**
 * Componente principal do aplicativo.
 * 
 * Estrutura:
 * - ThemeProvider: gerencia o tema (modo claro/escuro)
 * - AuthProvider: gerencia o estado de autenticação (usuário logado, tokens, etc)
 * - Navigation: define todas as telas e a navegação entre elas
 * - StatusBar: barra de status do dispositivo
 */
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import Navigation from './src/navigation';

function AppContent() {
  const { theme } = useTheme();
  
  return (
    <>
      <Navigation />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
