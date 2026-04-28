export interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  assignee: string;
  priority?: string;
  status: string;
  order: number;
  dueDate?: Date;
  createdAt: Date;
}
