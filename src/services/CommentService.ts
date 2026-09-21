import type { Comment } from '@/types/interfaces/Comment';
import axiosService from './interceptors/Api';

export async function getComment(id: string): Promise<Comment> {
  const res = await axiosService.get(`/comments/${id}`)

  if (!res.data) {
    throw new Error('Comments not found')
  }

  return res.data
}

export async function getCommentsByTask(taskId: string): Promise<Comment[]> {
  const res = await axiosService.get(`/comments?taskId=${taskId}`);

  return res.data;
}

export async function createComment(comment: Comment): Promise<Comment> {
  const res = await axiosService.post('/comments', comment);

  return res.data;
}
