export interface Task {
  id: string;
  title: string;
  description: string;
  term: string;
  conclusion: boolean;
  authorId: string;
  tags: string[];
  createdAt: string;
  code: string;
  locale: string;
}
