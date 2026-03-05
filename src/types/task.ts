export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  createdAt: string;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  language?: string;
  isCode: boolean;
  createdAt: string;
  pinned: boolean;
}
