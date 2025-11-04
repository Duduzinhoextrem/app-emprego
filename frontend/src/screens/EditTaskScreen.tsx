import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { tasksAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import type { RootStackParamList } from '../types/navigation';

type EditTaskRouteProp = RouteProp<RootStackParamList, 'EditTask'>;

export default function EditTaskScreen() {
  const navigation = useNavigation();
  const route = useRoute<EditTaskRouteProp>();
  const task = route.params?.task;
  const { colors } = useTheme();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTask, setLoadingTask] = useState(true);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setLoadingTask(false);
    } else {
      Alert.alert('Erro', 'Tarefa não encontrada');
      navigation.goBack();
    }
  }, [task]);

  async function handleUpdate() {
    if (!title.trim()) {
      Alert.alert('Erro', 'O título é obrigatório');
      return;
    }

    if (!task) return;

    setLoading(true);
    try {
      await tasksAPI.updateTask(task.id, { title, description });
      Alert.alert('Sucesso', 'Tarefa atualizada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.detail || 'Erro ao atualizar tarefa');
    } finally {
      setLoading(false);
    }
  }

  if (loadingTask) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Editar Tarefa</Text>
      
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
        placeholder="Título *"
        placeholderTextColor={colors.textMuted}
        value={title}
        onChangeText={setTitle}
      />
      
      <TextInput
        style={[styles.input, styles.textArea, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
        placeholder="Descrição"
        placeholderTextColor={colors.textMuted}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleUpdate}
        disabled={loading}
      >
        <Text style={[styles.buttonText, { color: colors.primaryText }]}>
          {loading ? 'Salvando...' : 'Salvar Alterações'}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    flex: 1,
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
});

