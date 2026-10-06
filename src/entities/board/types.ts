export type BoardTask = {
  id: string;
  title: string;
  description?: string;
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
