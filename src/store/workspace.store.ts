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

type CreateBoardInput = {
  workspaceId: string;
  name: string;
};

interface WorkspaceState {
  workspaces: WorkspaceSummary[];
  createWorkspace: (input: CreateWorkspaceInput) => WorkspaceSummary;
  createBoard: (
    input: CreateBoardInput,
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
