import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { authAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import type { RootStackParamList } from '../types/navigation';

type ResetPasswordRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen() {
  const navigation = useNavigation();
  const route = useRoute<ResetPasswordRouteProp>();
  const { colors } = useTheme();
  const [token, setToken] = useState(route.params?.token || '');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    if (!token.trim()) {
      Alert.alert('Erro', 'Digite o token de recuperação');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Erro', 'Digite a nova senha');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 8 caracteres');
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(token, newPassword, newPasswordConfirm);
      Alert.alert(
        'Sucesso',
        'Senha redefinida com sucesso! Você já pode fazer login.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.response?.data?.token?.[0] ||
        error.response?.data?.new_password?.[0] ||
        error.response?.data?.detail ||
        'Erro ao redefinir senha'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>Redefinir Senha</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Digite o token recebido e sua nova senha.
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>Token de Recuperação</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
        placeholder="Cole o token aqui"
        placeholderTextColor={colors.textMuted}
        value={token}
        onChangeText={setToken}
        autoCapitalize="none"
      />

      <Text style={[styles.label, { color: colors.text }]}>Nova Senha</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
        placeholder="Mínimo 8 caracteres"
        placeholderTextColor={colors.textMuted}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <Text style={[styles.label, { color: colors.text }]}>Confirmar Nova Senha</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
        placeholder="Digite a senha novamente"
        placeholderTextColor={colors.textMuted}
        value={newPasswordConfirm}
        onChangeText={setNewPasswordConfirm}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text style={[styles.buttonText, { color: colors.primaryText }]}>
          {loading ? 'Redefinindo...' : 'Redefinir Senha'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.backButtonText, { color: colors.primary }]}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
  },
});

