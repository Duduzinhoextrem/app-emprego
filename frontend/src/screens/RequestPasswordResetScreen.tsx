import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

export default function RequestPasswordResetScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  async function handleRequestReset() {
    if (!email.trim()) {
      Alert.alert('Erro', 'Digite seu email');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.requestPasswordReset(email);
      
      // Em desenvolvimento, o backend retorna o token
      if (response.token) {
        setToken(response.token);
        Alert.alert(
          'Token Gerado',
          `Token de recuperação: ${response.token}\n\nCopie este token para a próxima tela.`,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('ResetPassword', { token: response.token }),
            },
          ]
        );
      } else {
        Alert.alert(
          'Sucesso',
          'Se o email existir no sistema, você receberá instruções para redefinir sua senha.'
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.response?.data?.email?.[0] || error.response?.data?.detail || 'Erro ao solicitar recuperação de senha'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>Recuperar Senha</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Digite seu email para receber um token de recuperação de senha.
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>Email</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
        placeholder="seu@email.com"
        placeholderTextColor={colors.textMuted}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleRequestReset}
        disabled={loading}
      >
        <Text style={[styles.buttonText, { color: colors.primaryText }]}>
          {loading ? 'Enviando...' : 'Enviar Token'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.backButtonText, { color: colors.primary }]}>Voltar para Login</Text>
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

