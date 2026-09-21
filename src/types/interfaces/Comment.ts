export interface CommentBase {
  id: string
  taskId: string
  authorId: string
  text: string
  createdAt: string
}

export interface Comment extends CommentBase {
    id: string,
    taskId: string,
    authorId: string
    createdAt: string
}