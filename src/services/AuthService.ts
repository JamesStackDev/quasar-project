import type { User } from '@/types/interfaces/User';
import axiosService from './interceptors/Api';
import { ref } from 'vue';

export const currentUserId = ref<string | null>(getUser()?.id ?? null);

export async function login(email: string, password: string): Promise<string> {
  const res = await axiosService(`/users?email:eq=${email}`);
  const users: User[] = res.data;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const token = 'token-fake-123';
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify({ id: user.id, name: user.name }));
  currentUserId.value = user.id;
  return token;
}

export function getUser(): { id: string; name: string } | null {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUserId.value = null;
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}
