import type { WorkspaceSummary } from '../entities/workspace/types';

const workspaceSummaries: WorkspaceSummary[] = [
  {
    id: 'personal',
    name: 'Personal Workspace',
    type: 'personal',
    description: 'Private planning space for boards, tasks, and notes.',
    memberCount: 1,
    boards: [
      {
        id: 'main',
        name: 'Personal board',
      },
      {
        id: 'weekly',
        name: 'Weekly plan',
      },
    ],
  },
  {
    id: 'team',
    name: 'Team Operations',
    type: 'team',
    description: 'Shared workspace for members, boards, and activity.',
    memberCount: 4,
    boards: [
      {
        id: 'main',
        name: 'Team board',
      },
      {
        id: 'delivery',
        name: 'Delivery roadmap',
      },
    ],
  },
];

export function getWorkspaceSummaries() {
  return workspaceSummaries;
}

export function getWorkspaceById(workspaceId: string) {
  return workspaceSummaries.find((workspace) => workspace.id === workspaceId);
}

export function getBoardById(workspaceId: string, boardId: string) {
  return getWorkspaceById(workspaceId)?.boards.find(
    (board) => board.id === boardId,
  );
}
