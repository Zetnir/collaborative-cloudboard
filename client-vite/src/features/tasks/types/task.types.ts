export interface Comment {
  user: string;
  text: string;
  createdAt: Date;
}

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
  comments: Comment[];
}
