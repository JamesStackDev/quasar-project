import axiosService from './interceptors/Api';
import type { Task } from '@/types/interfaces/Tasks';

export async function getAllTasks(): Promise<Task[]> {
  const res = await axiosService.get('/tasks');

  return res.data;
}
export async function getTask(id: string): Promise<Task> {
  const res = await axiosService.get(`/tasks/${id}`);

  if (!res.data) {
    throw new Error('Task not found');
  }

  return res.data;
}

export async function createTasks(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  const newTask = {
    ...task,
    createdAt: new Date().toISOString(),
  };

  const res = await axiosService.post('/tasks', newTask);

  return res.data;
}

export async function updateTasks(id: string, task: Partial<Task>): Promise<Task> {
  const res = await axiosService.patch(`/tasks/${id}`, task);

  return res.data;
}

export async function deleteTasks(id: string): Promise<void> {
  await axiosService.delete(`/tasks/${id}`);
}
