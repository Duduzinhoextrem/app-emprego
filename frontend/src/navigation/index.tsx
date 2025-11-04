import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RequestPasswordResetScreen from '../screens/RequestPasswordResetScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import TasksScreen from '../screens/TasksScreen';
import NewTaskScreen from '../screens/NewTaskScreen';
import EditTaskScreen from '../screens/EditTaskScreen';
import UsersScreen from '../screens/UsersScreen';
import type { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Tasks"
            component={TasksScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NewTask"
            component={NewTaskScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditTask"
            component={EditTaskScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Users"
            component={UsersScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RequestPasswordReset"
            component={RequestPasswordResetScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPasswordScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
