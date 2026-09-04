import axiosService from './interceptors/Api'
import type { Comment } from '@/types/interfaces/Comment'

export async function getCommentsByTask(taskId: string): Promise<Comment[]> {
  const res = await axiosService.get(`/comments?taskId:eq=${taskId}`)
  return res.data
}

export async function createComment(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
  const res = await axiosService.post('/comments', { ...comment, createdAt: new Date().toISOString() })
  return res.data
}

export async function deleteComment(id: string): Promise<void> {
  await axiosService.delete(`/comments/${id}`)
}