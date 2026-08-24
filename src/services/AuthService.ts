import type { User } from '@/types/interfaces/User';
import axiosService from './interceptors/Api';

export async function login(email: string, password: string): Promise<string> {
    const res = await axiosService(`/users?email:eq=${email}`);
    const users: User[] = res.data;

    const user = users.find((u) => u.password === password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const token = 'token-fake-123';
    localStorage.setItem('token', token);
    return token;
  }

export function logout(): void {
    localStorage.removeItem('token');
  }

export function getToken(): string | null {
    return localStorage.getItem('token');
  }
 