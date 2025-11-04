import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { authAPI } from '../services/api';
import type { User } from '../types';
import type { RootStackParamList } from '../types/navigation';

type UsersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function UsersScreen() {
  const navigation = useNavigation<UsersScreenNavigationProp>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const usersData = await authAPI.getUsers();
      setUsers(usersData);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(userId: number, username: string) {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir o usuário "${username}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await authAPI.deleteUser(userId);
              Alert.alert('Sucesso', 'Usuário excluído com sucesso');
              loadUsers();
            } catch (error: any) {
              Alert.alert(
                'Erro',
                error.response?.data?.detail || 'Erro ao excluir usuário'
              );
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: colors.primary }]}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Gerenciar Usuários</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.userItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {item.username}
              </Text>
              {item.first_name && (
                <Text style={[styles.userFullName, { color: colors.textSecondary }]}>
                  {item.first_name} {item.last_name}
                </Text>
              )}
              {item.email && (
                <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                  {item.email}
                </Text>
              )}
              {(item.is_staff || item.is_superuser) && (
                <Text style={[styles.adminBadge, { color: colors.primary }]}>
                  Administrador
                </Text>
              )}
            </View>
            {user?.is_staff || user?.is_superuser ? (
              item.id !== user?.id ? (
                <TouchableOpacity
                  style={[styles.deleteButton, { backgroundColor: '#dc3545' }]}
                  onPress={() => deleteUser(item.id, item.username)}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.currentUserBadge}>
                  <Text style={[styles.currentUserText, { color: colors.textSecondary }]}>
                    Você
                  </Text>
                </View>
              )
            ) : null}
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Nenhum usuário encontrado
          </Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 80,
  },
  listContent: {
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userFullName: {
    fontSize: 14,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    marginTop: 4,
  },
  adminBadge: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 8,
    marginLeft: 12,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  currentUserBadge: {
    padding: 8,
    marginLeft: 12,
  },
  currentUserText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
