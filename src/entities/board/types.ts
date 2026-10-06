export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type BoardTask = {
  id: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  assignee?: string;
};

export type BoardColumn = {
  id: string;
  title: string;
  tasks: BoardTask[];
};

export type BoardContent = {
  id: string;
  workspaceId: string;
  boardId: string;
  columns: BoardColumn[];
};
