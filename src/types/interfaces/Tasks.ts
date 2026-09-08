export interface Task {
    id: string,
    title: string,
    description: Record<string, string>,
    term: string,
    conclusion: boolean,
    authorId: string,
    createdAt: string,
    code: string
}