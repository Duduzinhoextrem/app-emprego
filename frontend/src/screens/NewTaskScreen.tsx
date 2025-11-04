import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { tasksAPI, authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { User } from '../types';

export default function NewTaskScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showUserPicker, setShowUserPicker] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const usersData = await authAPI.getUsers();
      setUsers(usersData);
      
      if (!user?.is_staff && !user?.is_superuser && usersData.length > 0) {
        const currentUser = usersData.find(u => u.id === user?.id);
        if (currentUser) {
          setAssignedTo(currentUser.id);
        }
      } else if (usersData.length > 0) {
        setAssignedTo(user?.id || usersData[0].id);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar usuários');
    } finally {
      setLoadingUsers(false);
    }
  }

  async function handleCreate() {
    if (!title.trim()) {
      Alert.alert('Erro', 'O título é obrigatório');
      return;
    }

    if (!assignedTo) {
      Alert.alert('Erro', 'Selecione um usuário para designar a tarefa');
      return;
    }

    setLoading(true);
    try {
      await tasksAPI.createTask({ title, description, assigned_to: assignedTo });
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.detail || error.response?.data?.assigned_to?.[0] || 'Erro ao criar tarefa');
    } finally {
      setLoading(false);
    }
  }

  if (loadingUsers) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>Nova Tarefa</Text>
      
      <Text style={[styles.label, { color: colors.text }]}>Título *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
        placeholder="Título *"
        placeholderTextColor={colors.textMuted}
        value={title}
        onChangeText={setTitle}
      />
      
      <Text style={[styles.label, { color: colors.text }]}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.textArea, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
        placeholder="Descrição (opcional)"
        placeholderTextColor={colors.textMuted}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      
      <Text style={[styles.label, { color: colors.text }]}>Usuário Designado *</Text>
      <TouchableOpacity
        style={[styles.pickerContainer, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}
        onPress={() => setShowUserPicker(true)}
      >
        <Text style={[styles.pickerText, { color: assignedTo ? colors.text : colors.textMuted }]}>
          {assignedTo 
            ? users.find(u => u.id === assignedTo)?.username + (users.find(u => u.id === assignedTo)?.first_name ? ` - ${users.find(u => u.id === assignedTo)?.first_name}` : '')
            : 'Selecione um usuário...'}
        </Text>
        <Text style={[styles.pickerArrow, { color: colors.textSecondary }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={showUserPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUserPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Selecionar Usuário</Text>
            <FlatList
              data={users}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.userItem,
                    { backgroundColor: assignedTo === item.id ? colors.primary + '20' : 'transparent' },
                    { borderBottomColor: colors.border }
                  ]}
                  onPress={() => {
                    setAssignedTo(item.id);
                    setShowUserPicker(false);
                  }}
                >
                  <Text style={[styles.userItemText, { color: colors.text }]}>
                    {item.username}{item.first_name ? ` - ${item.first_name}` : ''}
                  </Text>
                  {assignedTo === item.id && (
                    <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowUserPicker(false)}
            >
              <Text style={[styles.modalCloseButtonText, { color: colors.primaryText }]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleCreate}
        disabled={loading}
      >
        <Text style={[styles.buttonText, { color: colors.primaryText }]}>
          {loading ? 'Criando...' : 'Criar Tarefa'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.cancelButton, { backgroundColor: colors.buttonSecondary, borderColor: colors.primary }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, styles.cancelButtonText, { color: colors.primary }]}>
          Cancelar
        </Text>
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
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 20,
  },
  input: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 5,
  },
  pickerContainer: {
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  pickerText: {
    fontSize: 16,
    flex: 1,
  },
  pickerArrow: {
    fontSize: 12,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    borderRadius: 10,
    padding: 20,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  userItemText: {
    fontSize: 16,
    flex: 1,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalCloseButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
