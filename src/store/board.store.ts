import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BoardColumn, BoardContent } from '../entities/board/types';
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

interface BoardState {
  boards: Record<string, BoardContent>;
  getBoardContent: (workspaceId: string, boardId: string) => BoardContent;
  addColumn: (input: AddColumnInput) => void;
  addTask: (input: AddTaskInput) => void;
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
                        },
                      ],
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
