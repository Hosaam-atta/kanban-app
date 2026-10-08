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

type ReorderColumnInput = ColumnInput & {
  targetColumnId: string;
};

type UpdateColumnInput = ColumnInput & {
  title: string;
};

type TaskInput = ColumnInput & {
  taskId: string;
};

type MoveTaskInput = TaskInput & {
  direction: 'left' | 'right';
};

type MoveTaskToPositionInput = TaskInput & {
  targetColumnId: string;
  targetTaskId?: string;
};

type ReorderTaskInput = TaskInput & {
  direction: 'up' | 'down';
};

type UpdateTaskInput = TaskInput & {
  title: string;
};

type UpdateTaskDetailsInput = TaskInput &
  Partial<
    Pick<BoardTask, 'assignee' | 'description' | 'dueDate' | 'labels' | 'title'>
  >;

interface BoardState {
  boards: Record<string, BoardContent>;
  getBoardContent: (workspaceId: string, boardId: string) => BoardContent;
  deleteBoardContent: (workspaceId: string, boardId: string) => void;
  deleteWorkspaceContent: (workspaceId: string) => void;
  addColumn: (input: AddColumnInput) => void;
  reorderColumn: (input: ReorderColumnInput) => void;
  updateColumn: (input: UpdateColumnInput) => void;
  deleteColumn: (input: ColumnInput) => void;
  addTask: (input: AddTaskInput) => BoardTask | undefined;
  moveTask: (input: MoveTaskInput) => void;
  moveTaskToPosition: (input: MoveTaskToPositionInput) => void;
  reorderTask: (input: ReorderTaskInput) => void;
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
      reorderColumn: ({ workspaceId, boardId, columnId, targetColumnId }) => {
        if (columnId === targetColumnId) {
          return;
        }

        const key = createBoardKey(workspaceId, boardId);
        const board =
          get().boards[key] ?? createInitialBoardContent(workspaceId, boardId);
        const sourceIndex = board.columns.findIndex(
          (column) => column.id === columnId,
        );
        const targetIndex = board.columns.findIndex(
          (column) => column.id === targetColumnId,
        );

        if (sourceIndex === -1 || targetIndex === -1) {
          return;
        }

        const columns = [...board.columns];
        const [column] = columns.splice(sourceIndex, 1);
        columns.splice(targetIndex, 0, column);

        set((state) => ({
          boards: {
            ...state.boards,
            [key]: {
              ...board,
              columns,
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
          return undefined;
        }

        const key = createBoardKey(workspaceId, boardId);
        const board =
          get().boards[key] ?? createInitialBoardContent(workspaceId, boardId);
        const task: BoardTask = {
          id: createId('task', cleanTitle),
          title: cleanTitle,
          labels: [],
        };

        set((state) => ({
          boards: {
            ...state.boards,
            [key]: {
              ...board,
              columns: board.columns.map((column) =>
                column.id === columnId
                  ? {
                      ...column,
                      tasks: [...column.tasks, task],
                    }
                  : column,
              ),
            },
          },
        }));

        return task;
      },
      moveTask: ({ workspaceId, boardId, columnId, taskId, direction }) => {
        const key = createBoardKey(workspaceId, boardId);
        const board =
          get().boards[key] ?? createInitialBoardContent(workspaceId, boardId);
        const sourceColumnIndex = board.columns.findIndex(
          (column) => column.id === columnId,
        );

        if (sourceColumnIndex === -1) {
          return;
        }

        const targetColumnIndex =
          direction === 'left' ? sourceColumnIndex - 1 : sourceColumnIndex + 1;
        const sourceColumn = board.columns[sourceColumnIndex];
        const targetColumn = board.columns[targetColumnIndex];
        const task = sourceColumn.tasks.find(
          (currentTask) => currentTask.id === taskId,
        );

        if (!targetColumn || !task) {
          return;
        }

        set((state) => ({
          boards: {
            ...state.boards,
            [key]: {
              ...board,
              columns: board.columns.map((column) => {
                if (column.id === sourceColumn.id) {
                  return {
                    ...column,
                    tasks: column.tasks.filter(
                      (currentTask) => currentTask.id !== taskId,
                    ),
                  };
                }

                if (column.id === targetColumn.id) {
                  return {
                    ...column,
                    tasks: [...column.tasks, task],
                  };
                }

                return column;
              }),
            },
          },
        }));
      },
      moveTaskToPosition: ({
        workspaceId,
        boardId,
        columnId,
        taskId,
        targetColumnId,
        targetTaskId,
      }) => {
        const key = createBoardKey(workspaceId, boardId);
        const board =
          get().boards[key] ?? createInitialBoardContent(workspaceId, boardId);
        const sourceColumn = board.columns.find(
          (column) => column.id === columnId,
        );
        const targetColumn = board.columns.find(
          (column) => column.id === targetColumnId,
        );
        const task = sourceColumn?.tasks.find(
          (currentTask) => currentTask.id === taskId,
        );

        if (!sourceColumn || !targetColumn || !task) {
          return;
        }

        const columns = board.columns.map((column) => {
          if (column.id === sourceColumn.id) {
            return {
              ...column,
              tasks: column.tasks.filter(
                (currentTask) => currentTask.id !== taskId,
              ),
            };
          }

          return column;
        });

        const nextColumns = columns.map((column) => {
          if (column.id !== targetColumn.id) {
            return column;
          }

          const tasks = [...column.tasks];
          const targetTaskIndex = targetTaskId
            ? tasks.findIndex((currentTask) => currentTask.id === targetTaskId)
            : -1;
          const insertIndex =
            targetTaskIndex >= 0 ? targetTaskIndex : tasks.length;

          tasks.splice(insertIndex, 0, task);

          return {
            ...column,
            tasks,
          };
        });

        set((state) => ({
          boards: {
            ...state.boards,
            [key]: {
              ...board,
              columns: nextColumns,
            },
          },
        }));
      },
      reorderTask: ({ workspaceId, boardId, columnId, taskId, direction }) => {
        const key = createBoardKey(workspaceId, boardId);
        const board =
          get().boards[key] ?? createInitialBoardContent(workspaceId, boardId);
        const column = board.columns.find(
          (currentColumn) => currentColumn.id === columnId,
        );

        if (!column) {
          return;
        }

        const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
        const targetIndex = direction === 'up' ? taskIndex - 1 : taskIndex + 1;

        if (
          taskIndex === -1 ||
          targetIndex < 0 ||
          targetIndex >= column.tasks.length
        ) {
          return;
        }

        const tasks = [...column.tasks];
        const [task] = tasks.splice(taskIndex, 1);
        tasks.splice(targetIndex, 0, task);

        set((state) => ({
          boards: {
            ...state.boards,
            [key]: {
              ...board,
              columns: board.columns.map((currentColumn) =>
                currentColumn.id === columnId
                  ? {
                      ...currentColumn,
                      tasks,
                    }
                  : currentColumn,
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
