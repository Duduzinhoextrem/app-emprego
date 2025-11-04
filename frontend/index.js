/**
 * Arquivo de entrada do app React Native (Expo).
 * 
 * Registra o componente principal (App) no sistema Expo.
 * Funciona tanto no Expo Go quanto em builds nativos.
 */
import { registerRootComponent } from 'expo';

import App from './App';

// Registra o componente principal no sistema
// Isso permite que o Expo Go ou build nativo encontrem o app
registerRootComponent(App);
