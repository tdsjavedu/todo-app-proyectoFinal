import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: number;
  title: string;
  description: string;
  type: 'trabajo' | 'casa' | 'negocios';
  completed: boolean;
  createdAt: string;
}

interface NewTask {
  title: string;
  description: string;
  type: 'trabajo' | 'casa' | 'negocios';
}

type ViewType = 'home' | 'add' | 'list' | 'details';

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<NewTask>({
    title: '',
    description: '',
    type: 'trabajo'
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('tasks');
      if (jsonValue !== null) {
        setTasks(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Error loading tasks:', e);
    }
  };

  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (e) {
      console.error('Error saving tasks:', e);
    }
  };

  const addTask = () => {
    if (newTask.title.trim() === '') return;

    const task: Task = {
      id: Date.now(),
      ...newTask,
      completed: false,
      createdAt: new Date().toISOString()
    };

    saveTasks([...tasks, task]);
    setNewTask({ title: '', description: '', type: 'trabajo' });
    setCurrentView('list');
  };

  const toggleTask = (id: number) => {
    const updated = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updated);
  };

  const deleteTask = (id: number) => {
    saveTasks(tasks.filter(task => task.id !== id));
    if (selectedTask?.id === id) {
      setCurrentView('list');
    }
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  // Pantalla de Inicio
  if (currentView === 'home') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Lista de Tareas</Text>
          <Text style={styles.headerSubtitle}>Organiza tu día de manera eficiente</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={[styles.card, styles.pendingCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Tareas Pendientes</Text>
            </View>
            <Text style={styles.cardNumber}>{pendingTasks.length}</Text>
            <Text style={styles.cardSubtitle}>Por completar</Text>
          </View>

          <View style={[styles.card, styles.completedCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Tareas Completadas</Text>
            </View>
            <Text style={styles.cardNumber}>{completedTasks.length}</Text>
            <Text style={styles.cardSubtitle}>Finalizadas</Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setCurrentView('add')}
          >
            <Text style={styles.primaryButtonText}>➕ Agregar Tarea</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setCurrentView('list')}
          >
            <Text style={styles.secondaryButtonText}>Ver Lista</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Pantalla Agregar Tarea
  if (currentView === 'add') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentView('home')}>
            <Text style={styles.backButton}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agregar Nueva Tarea</Text>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            value={newTask.title}
            onChangeText={(text) => setNewTask({ ...newTask, title: text })}
            placeholder="Ej: Completar informe mensual"
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={newTask.description}
            onChangeText={(text) => setNewTask({ ...newTask, description: text })}
            placeholder="Detalles adicionales..."
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Tipo de Tarea</Text>
          <View style={styles.typeContainer}>
            {(['trabajo', 'casa', 'negocios'] as const).map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => setNewTask({ ...newTask, type })}
                style={[
                  styles.typeButton,
                  newTask.type === type && styles.typeButtonActive
                ]}
              >
                <Text style={[
                  styles.typeButtonText,
                  newTask.type === type && styles.typeButtonTextActive
                ]}>
                  {type === 'trabajo' ? '💼' : type === 'casa' ? '🏠' : '📈'} {type.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, !newTask.title.trim() && styles.disabledButton]}
            onPress={addTask}
            disabled={!newTask.title.trim()}
          >
            <Text style={styles.primaryButtonText}>Agregar Tarea</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Pantalla Detalles
  if (currentView === 'details' && selectedTask) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentView('list')}>
            <Text style={styles.backButton}>← Volver a la lista</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalles de la Tarea</Text>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.detailTitle}>{selectedTask.title}</Text>
          
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {selectedTask.type === 'trabajo' ? '💼' : selectedTask.type === 'casa' ? '🏠' : '📈'} {selectedTask.type.toUpperCase()}
            </Text>
          </View>

          <View style={[styles.statusBadge, selectedTask.completed ? styles.completedBadge : styles.pendingBadge]}>
            <Text style={styles.statusBadgeText}>
              {selectedTask.completed ? '✓ Completada' : '○ Pendiente'}
            </Text>
          </View>

          {selectedTask.description && (
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionTitle}>Descripción</Text>
              <Text style={styles.descriptionText}>{selectedTask.description}</Text>
            </View>
          )}

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Información</Text>
            <Text style={styles.infoText}>
              Creada el {new Date(selectedTask.createdAt).toLocaleDateString('es-ES')}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, selectedTask.completed ? styles.orangeButton : styles.greenButton]}
            onPress={() => toggleTask(selectedTask.id)}
          >
            <Text style={styles.primaryButtonText}>
              {selectedTask.completed ? 'Marcar como Pendiente' : '✓ Marcar como Completada'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteTask(selectedTask.id)}
          >
            <Text style={styles.primaryButtonText}>🗑 Eliminar Tarea</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Pantalla Lista
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView('home')}>
          <Text style={styles.backButton}>← Volver al inicio</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Tareas</Text>
        <Text style={styles.headerSubtitle}>
          {pendingTasks.length} pendientes, {completedTasks.length} completadas
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No hay tareas aún</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setCurrentView('add')}
            >
              <Text style={styles.primaryButtonText}>➕ Crear primera tarea</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {tasks.map(task => (
              <TouchableOpacity
                key={task.id}
                style={[styles.taskItem, task.completed && styles.taskItemCompleted]}
                onPress={() => {
                  setSelectedTask(task);
                  setCurrentView('details');
                }}
              >
                <TouchableOpacity
                  onPress={() => toggleTask(task.id)}
                  style={styles.checkbox}
                >
                  <Text style={styles.checkboxIcon}>
                    {task.completed ? '✓' : '○'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                    {task.title}
                  </Text>
                  {task.description && (
                    <Text style={styles.taskDescription} numberOfLines={2}>
                      {task.description}
                    </Text>
                  )}
                  <Text style={styles.taskType}>
                    {task.type === 'trabajo' ? '💼' : task.type === 'casa' ? '🏠' : '📈'} {task.type}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => deleteTask(task.id)}
                  style={styles.deleteIcon}
                >
                  <Text style={styles.deleteIconText}>🗑</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.primaryButton, { marginTop: 20 }]}
              onPress={() => setCurrentView('add')}
            >
              <Text style={styles.primaryButtonText}>➕ Agregar Nueva Tarea</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#4F46E5',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#C7D2FE',
  },
  backButton: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  pendingCard: {
    backgroundColor: '#FFF7ED',
  },
  completedCard: {
    backgroundColor: '#F0FDF4',
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  cardNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginVertical: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  secondaryButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#4F46E5',
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 8,
    marginBottom: 20,
  },
  completedBadge: {
    backgroundColor: '#D1FAE5',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionBox: {
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#3B82F6',
  },
  greenButton: {
    backgroundColor: '#10B981',
  },
  orangeButton: {
    backgroundColor: '#F97316',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  taskItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DBEAFE',
  },
  taskItemCompleted: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  checkbox: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  checkboxIcon: {
    fontSize: 24,
    color: '#4F46E5',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  taskType: {
    fontSize: 12,
    color: '#6B7280',
  },
  deleteIcon: {
    padding: 5,
  },
  deleteIconText: {
    fontSize: 20,
  },
});