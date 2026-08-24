import axiosService from "./interceptors/Api";
import type { Task } from "@/types/interfaces/Tasks";

export async function getAllTasks(): Promise<Task[]> {
    const res = await axiosService.get('/tasks');

    return res.data
    
}
export async function getTask(id: number): Promise<Task> {
    const res = await axiosService.get(`/tasks/${id}`);
    
    if(!res.data) {
        throw new Error('Task not found')
    }
    
    return res.data
}

export async function createTasks(task: Omit<Task, 'id'>): Promise<Task> {
    const res = await axiosService.post('/tasks', task);

    return res.data
}
export async function updateTasks(id:number ,task: Partial<Task>): Promise<Task> {
    const res = await axiosService.patch(`/tasks/${id}`, task);

    return res.data
}

export async function deleteTasks(id:number): Promise<void> {
    await axiosService.delete(`/tasks/${id}`)
}


