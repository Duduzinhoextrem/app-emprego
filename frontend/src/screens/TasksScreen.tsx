import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TextInput, Modal, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { tasksAPI } from '../services/api';
import type { Task } from '../types';
import type { RootStackParamList } from '../types/navigation';

type TasksScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type FilterStatus = 'all' | 'pending' | 'completed';

export default function TasksScreen() {
  const navigation = useNavigation<TasksScreenNavigationProp>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const { user, logout } = useAuth();
  const { colors, theme, toggleTheme } = useTheme();

  useEffect(() => {
    loadTasks();
  }, [filterStatus]);

  async function loadTasks() {
    try {
      setLoading(true);
      const filters: any = {};
      
      if (filterStatus !== 'all') {
        filters.status = filterStatus;
      }
      
      if (dateFrom) {
        filters.created_at_gte = dateFrom;
      }
      
      if (dateTo) {
        filters.created_at_lte = dateTo;
      }
      
      const filtersToSend = Object.keys(filters).length > 0 ? filters : undefined;
      const data = await tasksAPI.getTasks(filtersToSend);
      setTasks(data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  }

  function applyDateFilter() {
    loadTasks();
    setShowDateFilter(false);
  }

  function clearDateFilter() {
    setDateFrom('');
    setDateTo('');
    loadTasks();
    setShowDateFilter(false);
  }

  async function toggleTask(task: Task) {
    try {
      if (task.completed) {
        await tasksAPI.reopenTask(task.id);
      } else {
        await tasksAPI.completeTask(task.id);
      }
      loadTasks();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar tarefa');
    }
  }

  async function deleteTask(id: number) {
    Alert.alert(
      'Confirmar',
      'Deseja excluir esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await tasksAPI.deleteTask(id);
              loadTasks();
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir tarefa');
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Minhas Tarefas</Text>
        <View style={styles.headerButtons}>
          {(user?.is_staff || user?.is_superuser) && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Users')}
              style={[styles.usersButton, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.usersButtonText, { color: colors.primaryText }]}>👥</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={toggleTheme}>
            <Text style={{ fontSize: 24 }}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={styles.logoutButtonContainer}>
            <Text style={[styles.logoutButton, { color: colors.primary }]}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.filtersContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: filterStatus === 'all' ? colors.primary : colors.background, borderColor: filterStatus === 'all' ? colors.primary : colors.border }
          ]}
          onPress={() => setFilterStatus('all')}
        >
          <Text style={[styles.filterButtonText, { color: filterStatus === 'all' ? colors.primaryText : colors.textSecondary }]}>
            Todas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: filterStatus === 'pending' ? colors.primary : colors.background, borderColor: filterStatus === 'pending' ? colors.primary : colors.border }
          ]}
          onPress={() => setFilterStatus('pending')}
        >
          <Text style={[styles.filterButtonText, { color: filterStatus === 'pending' ? colors.primaryText : colors.textSecondary }]}>
            Pendentes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: filterStatus === 'completed' ? colors.primary : colors.background, borderColor: filterStatus === 'completed' ? colors.primary : colors.border }
          ]}
          onPress={() => setFilterStatus('completed')}
        >
          <Text style={[styles.filterButtonText, { color: filterStatus === 'completed' ? colors.primaryText : colors.textSecondary }]}>
            Concluídas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: (dateFrom || dateTo) ? colors.primary : colors.background, borderColor: (dateFrom || dateTo) ? colors.primary : colors.border }
          ]}
          onPress={() => setShowDateFilter(true)}
        >
          <Text style={[styles.filterButtonText, { color: (dateFrom || dateTo) ? colors.primaryText : colors.textSecondary }]}>
            📅 Data
          </Text>
        </TouchableOpacity>
      </View>
      
      {(dateFrom || dateTo) && (
        <View style={[styles.dateFilterInfo, { backgroundColor: theme === 'dark' ? colors.card : '#e3f2fd', borderBottomColor: colors.border }]}>
          <Text style={[styles.dateFilterText, { color: colors.primary }]}>
            {dateFrom && `De: ${dateFrom}`}
            {dateFrom && dateTo && ' | '}
            {dateTo && `Até: ${dateTo}`}
          </Text>
          <TouchableOpacity onPress={clearDateFilter}>
            <Text style={[styles.clearDateFilterText, { color: colors.primary }]}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Modal
        visible={showDateFilter}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDateFilter(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filtrar por Data</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>Formato: YYYY-MM-DD</Text>
            
            <Text style={[styles.label, { color: colors.text }]}>Data Inicial (opcional)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
              placeholder="2024-01-01"
              placeholderTextColor={colors.textMuted}
              value={dateFrom}
              onChangeText={setDateFrom}
              keyboardType="default"
            />
            
            <Text style={[styles.label, { color: colors.text }]}>Data Final (opcional)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder, color: colors.text }]}
              placeholder="2024-12-31"
              placeholderTextColor={colors.textMuted}
              value={dateTo}
              onChangeText={setDateTo}
              keyboardType="default"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.background }]}
                onPress={() => setShowDateFilter(false)}
              >
                <Text style={[styles.modalButtonTextCancel, { color: colors.textSecondary }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.buttonDanger }]}
                onPress={clearDateFilter}
              >
                <Text style={[styles.modalButtonTextClear, { color: colors.buttonDangerText }]}>Limpar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={applyDateFilter}
              >
                <Text style={[styles.modalButtonText, { color: colors.primaryText }]}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.taskItem, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={styles.taskContent}
              onPress={() => toggleTask(item)}
            >
              <View style={[
                styles.checkbox,
                { borderColor: colors.primary },
                item.completed && { backgroundColor: colors.primary }
              ]}>
                {item.completed && <Text style={[styles.checkmark, { color: colors.primaryText }]}>✓</Text>}
              </View>
              <View style={styles.taskInfo}>
                <Text style={[
                  styles.taskTitle,
                  { color: item.completed ? colors.textMuted : colors.text },
                  item.completed && styles.taskTitleCompleted
                ]}>
                  {item.title}
                </Text>
                {item.description && (
                  <Text style={[styles.taskDescription, { color: colors.textSecondary }]}>{item.description}</Text>
                )}
                {item.assigned_to_username && (
                  <Text style={[styles.assignedText, { color: colors.primary }]}>
                    👤 {item.assigned_to_username}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('EditTask', { task: item })}
            >
              <Text style={styles.editButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTask(item.id)}
            >
              <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>Nenhuma tarefa encontrada</Text>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('NewTask')}
      >
        <Text style={[styles.fabText, { color: colors.primaryText }]}>+</Text>
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usersButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  usersButtonText: {
    fontSize: 20,
  },
  logoutButtonContainer: {
    marginLeft: 15,
  },
  logoutButton: {
    fontSize: 16,
  },
  taskItem: {
    flexDirection: 'row',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
  },
  taskDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  assignedText: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  editButton: {
    padding: 10,
    marginRight: 5,
  },
  editButtonText: {
    fontSize: 20,
  },
  deleteButton: {
    padding: 10,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  filtersContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    justifyContent: 'space-around',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateFilterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
  },
  dateFilterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  clearDateFilterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 12,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextClear: {
    fontSize: 16,
    fontWeight: '600',
  },
});
