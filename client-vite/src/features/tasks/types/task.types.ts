export interface Task {
  id: string;
  title: string;
  description?: string;
  project: string;
  assignee?: string | null;
  priority?: string;
  status: string;
  order: number;
  dueDate?: Date;
  createdAt: Date;
}
