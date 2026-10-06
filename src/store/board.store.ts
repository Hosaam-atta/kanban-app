import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  BoardColumn,
  BoardContent,
  BoardTask,
} from '../entities/board/types';
import { createInitialBoardContent } from '../services/board.service';

type AddColumnInput = {
  workspaceId: string;
  boardId: string;
  title: string;
};

type AddTaskInput = {
  workspaceId: string;
  boardId: string;
  columnId: string;
  title: string;
};

type ColumnInput = {
  workspaceId: string;
  boardId: string;
  columnId: string;
};

type UpdateColumnInput = ColumnInput & {
  title: string;
};

type TaskInput = ColumnInput & {
  taskId: string;
};

type UpdateTaskInput = TaskInput & {
  title: string;
};

type UpdateTaskDetailsInput = TaskInput &
  Partial<
    Pick<
      BoardTask,
      'assignee' | 'description' | 'dueDate' | 'priority' | 'status' | 'title'
    >
  >;

interface BoardState {
  boards: Record<string, BoardContent>;
  getBoardContent: (workspaceId: string, boardId: string) => BoardContent;
  deleteBoardContent: (workspaceId: string, boardId: string) => void;
  deleteWorkspaceContent: (workspaceId: string) => void;
  addColumn: (input: AddColumnInput) => void;
  updateColumn: (input: UpdateColumnInput) => void;
  deleteColumn: (input: ColumnInput) => void;
  addTask: (input: AddTaskInput) => void;
  updateTask: (input: UpdateTaskInput) => void;
  updateTaskDetails: (input: UpdateTaskDetailsInput) => void;
  deleteTask: (input: TaskInput) => void;
}

function createBoardKey(workspaceId: string, boardId: string) {
  return `${workspaceId}:${boardId}`;
}

function createId(prefix: string, value: string) {
  const slug =
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || prefix;

  return `${slug}-${Date.now()}`;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      boards: {},
      getBoardContent: (workspaceId, boardId) => {
        const key = createBoardKey(workspaceId, boardId);
        const existingBoard = get().boards[key];

        if (existingBoard) {
          return existingBoard;
        }

        return createInitialBoardContent(workspaceId, boardId);
      },
      deleteBoardContent: (workspaceId, boardId) => {
        const key = createBoardKey(workspaceId, boardId);

        set((state) => ({
          boards: Object.fromEntries(
            Object.entries(state.boards).filter(
              ([boardKey]) => boardKey !== key,
            ),
          ),
        }));
      },
      deleteWorkspaceContent: (workspaceId) => {
        set((state) => ({
          boards: Object.fromEntries(
            Object.entries(state.boards).filter(
              ([boardKey]) => !boardKey.startsWith(`${workspaceId}:`),
            ),
          ),
        }));
      },
      addColumn: ({ workspaceId, boardId, title }) => {
        const cleanTitle = title.trim();

        if (!cleanTitle) {
          return;
        }

        const key = createBoardKey(workspaceId, boardId);
        const board =
          get().boards[key] ?? createInitialBoardContent(workspaceId, boardId);
        const column: BoardColumn = {
          id: createId('column', cleanTitle),
          title: cleanTitle,
          tasks: [],
        };

        set((state) => ({
          boards: {
            ...state.boards,
            [key]: {
              ...board,
              columns: [...board.columns, column],
            },
          },
        }));
      },
      updateColumn: ({ workspaceId, boardId, columnId, title }) => {
        const cleanTitle = title.trim();

        if (!cleanTitle) {
          return;
        }

        const key = createBoardKey(workspaceId, boardId);
        const board =
          get().boards[key] ?? createInitialBoardContent(workspaceId, boardId);

        set((state) => ({
          boards: {
            ...state.boards,
            [key]: {
              ...board,
              columns: board.columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      title: cleanTitle,
                    }
                  : column,
              ),
            },
          },
        }));
      },
      deleteColumn: ({ workspaceId, boardId, columnId }) => {
        const key = createBoardKey(workspaceId, boardId);
        const board =
          get().boards[key] ?? createInitialBoardContent(workspaceId, boardId);

        set((state) => ({
          boards: {
            ...state.boards,
            [key]: {
              ...board,
              columns: board.columns.filter((column) => column.id !== columnId),
            },
          },
        }));
      },
      addTask: ({ workspaceId, boardId, columnId, title }) => {
        const cleanTitle = title.trim();

        if (!cleanTitle) {
          return;
        }

        const key = createBoardKey(workspaceId, boardId);
        const board =
          get().boards[key] ?? createInitialBoardContent(workspaceId, boardId);

        set((state) => ({
          boards: {
            ...state.boards,
            [key]: {
              ...board,
              columns: board.columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      tasks: [
                        ...column.tasks,
                        {
                          id: createId('task', cleanTitle),
                          title: cleanTitle,
                          priority: 'medium',
                          status: 'todo',
                        },
                      ],
                    }
                  : column,
              ),
            },
          },
        }));
      },
      updateTask: ({ workspaceId, boardId, columnId, taskId, title }) => {
        const cleanTitle = title.trim();

        if (!cleanTitle) {
          return;
        }

        const key = createBoardKey(workspaceId, boardId);
        const board =
          get().boards[key] ?? createInitialBoardContent(workspaceId, boardId);

        set((state) => ({
          boards: {
            ...state.boards,
            [key]: {
              ...board,
              columns: board.columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      tasks: column.tasks.map((task) =>
                        task.id === taskId
                          ? {
                              ...task,
                              title: cleanTitle,
                            }
                          : task,
                      ),
                    }
                  : column,
              ),
            },
          },
        }));
      },
      updateTaskDetails: ({
        workspaceId,
        boardId,
        columnId,
        taskId,
        ...details
      }) => {
        const key = createBoardKey(workspaceId, boardId);
        const board =
          get().boards[key] ?? createInitialBoardContent(workspaceId, boardId);

        set((state) => ({
          boards: {
            ...state.boards,
            [key]: {
              ...board,
              columns: board.columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      tasks: column.tasks.map((task) =>
                        task.id === taskId
                          ? {
                              ...task,
                              ...details,
                              title: details.title?.trim() || task.title,
                            }
                          : task,
                      ),
                    }
                  : column,
              ),
            },
          },
        }));
      },
      deleteTask: ({ workspaceId, boardId, columnId, taskId }) => {
        const key = createBoardKey(workspaceId, boardId);
        const board =
          get().boards[key] ?? createInitialBoardContent(workspaceId, boardId);

        set((state) => ({
          boards: {
            ...state.boards,
            [key]: {
              ...board,
              columns: board.columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      tasks: column.tasks.filter((task) => task.id !== taskId),
                    }
                  : column,
              ),
            },
          },
        }));
      },
    }),
    {
      name: 'kanban-boards',
    },
  ),
);
