export type WorkspaceType = 'personal' | 'team';

export type WorkspaceBoardSummary = {
  id: string;
  name: string;
};

export type WorkspaceSummary = {
  id: string;
  name: string;
  type: WorkspaceType;
  description: string;
  memberCount: number;
  boards: WorkspaceBoardSummary[];
};
