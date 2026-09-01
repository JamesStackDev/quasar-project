import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { createTasks, deleteTasks, getAllTasks, updateTasks } from '@/services/TaskService';
import type { Task } from '@/types/interfaces/Tasks';
import { currentUserId} from '@/services/AuthService';

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([]);

  const fetchTasks = async (): Promise<void> => {
    tasks.value = await getAllTasks();
  };

  const myTasks = computed(() => tasks.value.filter((t) => t.authorId === currentUserId.value))

  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>): Promise<void> => {
    const newTask = await createTasks(task);
    tasks.value.push(newTask);
  };

  const editTask = async (id: string, task: Partial<Task>): Promise<void> => {
    const updated = await updateTasks(id, task);
    const index = tasks.value.findIndex((t) => t.id === id);
    if (index !== -1) tasks.value[index] = updated;
  };

  const removeTask = async (id: string): Promise<void> => {
    await deleteTasks(id);
    tasks.value = tasks.value.filter((t) => t.id !== id);
  };

  return { tasks, myTasks, fetchTasks, addTask, editTask, removeTask };
});
