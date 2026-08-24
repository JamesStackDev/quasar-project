import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createTasks, deleteTasks, getAllTasks, updateTasks } from '@/services/TaskService'
import type { Task } from '@/types/interfaces/Tasks'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])

  const fetchTasks = async (): Promise<void> => {
    tasks.value = await getAllTasks()
  }

  const addTask = async(task: Omit<Task, 'id'>):  Promise<void> => {
    const newTasks = await createTasks(task)
    tasks.value.push(newTasks)
  }

  const editTask = async(id: number, task: Partial<Task> ): Promise<void> => {
    const updated = await updateTasks(id, task)
    const index = tasks.value.findIndex((t) => t.id === id) 
    if ( index !== -1) tasks.value[index] = updated
  }

  const removeTask = async(id: number): Promise<void> => {
    await deleteTasks(id)
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  return { tasks, fetchTasks, addTask, editTask, removeTask}
})