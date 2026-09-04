import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCommentsByTask, createComment } from '@/services/CommentService'
import type { Comment } from '@/types/interfaces/Comment'
import { currentUserId } from '@/services/AuthService'

export const useCommentStore = defineStore('comment', () => {
  const comments = ref<Comment[]>([])

  const fetchComments = async (taskId: string) => {
    comments.value = await getCommentsByTask(taskId)
  }

  const addComment = async (taskId: string, content: string) => {
    const newComment = await createComment({ taskId, content, authorId: currentUserId.value! })
    comments.value.push(newComment)
  }

  return { comments, fetchComments, addComment }
})