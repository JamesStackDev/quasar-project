interface TranslationBase {
  id: string;
  taskId: string;
  locale: string;
  text: string;
  authorId: string;
}

export interface Translation extends TranslationBase {
    id: string,
    taskId: string,
    authorId: string
}