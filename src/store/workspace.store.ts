import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  WorkspaceSummary,
  WorkspaceType,
} from '../entities/workspace/types';
import { getWorkspaceSummaries } from '../services/workspace.service';

type CreateWorkspaceInput = {
  name: string;
  type: WorkspaceType;
};

type WorkspaceInput = {
  workspaceId: string;
};

type UpdateWorkspaceInput = WorkspaceInput & {
  name: string;
};

type CreateBoardInput = {
  workspaceId: string;
  name: string;
};

type BoardInput = {
  workspaceId: string;
  boardId: string;
};

type UpdateBoardInput = BoardInput & {
  name: string;
};

interface WorkspaceState {
  workspaces: WorkspaceSummary[];
  createWorkspace: (input: CreateWorkspaceInput) => WorkspaceSummary;
  updateWorkspace: (input: UpdateWorkspaceInput) => void;
  deleteWorkspace: (input: WorkspaceInput) => WorkspaceSummary | undefined;
  createBoard: (
    input: CreateBoardInput,
  ) => WorkspaceSummary['boards'][number] | undefined;
  updateBoard: (input: UpdateBoardInput) => void;
  deleteBoard: (
    input: BoardInput,
  ) => WorkspaceSummary['boards'][number] | undefined;
  getWorkspaceById: (workspaceId: string) => WorkspaceSummary | undefined;
  getBoardById: (
    workspaceId: string,
    boardId: string,
  ) => WorkspaceSummary['boards'][number] | undefined;
}

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function createWorkspaceDescription(type: WorkspaceType) {
  return type === 'personal'
    ? 'Private planning space for boards, tasks, and notes.'
    : 'Shared workspace for members, boards, and activity.';
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspaces: getWorkspaceSummaries(),
      createWorkspace: ({ name, type }) => {
        const cleanName = name.trim();
        const baseId = createSlug(cleanName) || `${type}-workspace`;
        const exists = get().workspaces.some(
          (workspace) => workspace.id === baseId,
        );
        const id = exists ? `${baseId}-${Date.now()}` : baseId;
        const workspace: WorkspaceSummary = {
          id,
          name: cleanName,
          type,
          description: createWorkspaceDescription(type),
          memberCount: type === 'personal' ? 1 : 0,
          boards: [
            {
              id: 'main',
              name: type === 'personal' ? 'Personal board' : 'Team board',
            },
          ],
        };

        set((state) => ({
          workspaces: [...state.workspaces, workspace],
        }));

        return workspace;
      },
      updateWorkspace: ({ workspaceId, name }) => {
        const cleanName = name.trim();

        if (!cleanName) {
          return;
        }

        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === workspaceId
              ? {
                  ...workspace,
                  name: cleanName,
                }
              : workspace,
          ),
        }));
      },
      deleteWorkspace: ({ workspaceId }) => {
        const workspaces = get().workspaces;

        if (workspaces.length <= 1) {
          return undefined;
        }

        const nextWorkspace =
          workspaces.find((workspace) => workspace.id !== workspaceId) ??
          workspaces[0];

        set((state) => ({
          workspaces: state.workspaces.filter(
            (workspace) => workspace.id !== workspaceId,
          ),
        }));

        return nextWorkspace;
      },
      createBoard: ({ workspaceId, name }) => {
        const cleanName = name.trim();

        if (!cleanName) {
          return undefined;
        }

        const workspace = get().getWorkspaceById(workspaceId);

        if (!workspace) {
          return undefined;
        }

        const baseId = createSlug(cleanName) || 'board';
        const exists = workspace.boards.some((board) => board.id === baseId);
        const board = {
          id: exists ? `${baseId}-${Date.now()}` : baseId,
          name: cleanName,
        };

        set((state) => ({
          workspaces: state.workspaces.map((currentWorkspace) =>
            currentWorkspace.id === workspaceId
              ? {
                  ...currentWorkspace,
                  boards: [...currentWorkspace.boards, board],
                }
              : currentWorkspace,
          ),
        }));

        return board;
      },
      updateBoard: ({ workspaceId, boardId, name }) => {
        const cleanName = name.trim();

        if (!cleanName) {
          return;
        }

        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === workspaceId
              ? {
                  ...workspace,
                  boards: workspace.boards.map((board) =>
                    board.id === boardId
                      ? {
                          ...board,
                          name: cleanName,
                        }
                      : board,
                  ),
                }
              : workspace,
          ),
        }));
      },
      deleteBoard: ({ workspaceId, boardId }) => {
        const workspace = get().getWorkspaceById(workspaceId);

        if (!workspace || workspace.boards.length <= 1) {
          return undefined;
        }

        const nextBoard =
          workspace.boards.find((board) => board.id !== boardId) ??
          workspace.boards[0];

        set((state) => ({
          workspaces: state.workspaces.map((currentWorkspace) =>
            currentWorkspace.id === workspaceId
              ? {
                  ...currentWorkspace,
                  boards: currentWorkspace.boards.filter(
                    (board) => board.id !== boardId,
                  ),
                }
              : currentWorkspace,
          ),
        }));

        return nextBoard;
      },
      getWorkspaceById: (workspaceId) =>
        get().workspaces.find((workspace) => workspace.id === workspaceId),
      getBoardById: (workspaceId, boardId) =>
        get()
          .getWorkspaceById(workspaceId)
          ?.boards.find((board) => board.id === boardId),
    }),
    {
      name: 'kanban-workspaces',
    },
  ),
);
