import { ChevronDown, Plus, Users } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import type { WorkspaceSummary } from '../../../entities/workspace/types';
import { useWorkspaceStore } from '../../../store/workspace.store';

export function WorkspaceList() {
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const personalWorkspaces = workspaces.filter(
    (workspace) => workspace.type === 'personal',
  );
  const teamWorkspaces = workspaces.filter(
    (workspace) => workspace.type === 'team',
  );

  return (
    <div className="workspace-list" id="workspace-navigation">
      <WorkspaceGroup label="Personal" workspaces={personalWorkspaces} />
      <WorkspaceGroup label="Team" workspaces={teamWorkspaces} />
    </div>
  );
}

type WorkspaceGroupProps = {
  label: string;
  workspaces: WorkspaceSummary[];
};

function WorkspaceGroup({ label, workspaces }: WorkspaceGroupProps) {
  const [groupOpen, setGroupOpen] = useState(false);
  const groupId = `${label.toLowerCase()}-workspace-group`;

  return (
    <div className="workspace-group">
      <button
        aria-controls={groupId}
        aria-expanded={groupOpen}
        className="workspace-group-toggle"
        onClick={() => setGroupOpen((isOpen) => !isOpen)}
        type="button"
      >
        <span>{label}</span>
        <ChevronDown
          className={
            groupOpen
              ? 'sidebar-chevron sidebar-chevron-open'
              : 'sidebar-chevron'
          }
          size={14}
        />
      </button>

      {groupOpen ? (
        <div className="workspace-group-list" id={groupId}>
          {workspaces.map((workspace) => (
            <WorkspaceTree key={workspace.id} workspace={workspace} />
          ))}
          {workspaces.length === 0 ? (
            <p className="workspace-empty-note">No workspaces yet</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

type WorkspaceTreeProps = {
  workspace: WorkspaceSummary;
};

function WorkspaceTree({ workspace }: WorkspaceTreeProps) {
  const navigate = useNavigate();
  const createBoard = useWorkspaceStore((state) => state.createBoard);
  const [boardsOpen, setBoardsOpen] = useState(false);
  const [boardName, setBoardName] = useState('');

  function handleCreateBoard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const board = createBoard({
      workspaceId: workspace.id,
      name: boardName,
    });

    if (!board) {
      return;
    }

    setBoardName('');
    setBoardsOpen(true);
    navigate(`/workspaces/${workspace.id}/boards/${board.id}`);
  }

  return (
    <div className="workspace-tree">
      <button
        aria-controls={`${workspace.id}-boards`}
        aria-expanded={boardsOpen}
        className="workspace-option"
        onClick={() => setBoardsOpen((isOpen) => !isOpen)}
        type="button"
      >
        <span className="workspace-mini-icon" aria-hidden="true">
          <Users size={12} />
        </span>
        <span>{workspace.name}</span>
        <ChevronDown
          className={
            boardsOpen
              ? 'sidebar-chevron sidebar-chevron-open'
              : 'sidebar-chevron'
          }
          size={16}
        />
      </button>

      {boardsOpen ? (
        <div className="workspace-board-list" id={`${workspace.id}-boards`}>
          {workspace.boards.map((board) => (
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? 'workspace-board-link workspace-board-link-active'
                  : 'workspace-board-link'
              }
              key={board.id}
              to={`/workspaces/${workspace.id}/boards/${board.id}`}
            >
              {board.name}
            </NavLink>
          ))}
          <form className="workspace-board-form" onSubmit={handleCreateBoard}>
            <input
              aria-label={`New board in ${workspace.name}`}
              onChange={(event) => setBoardName(event.target.value)}
              placeholder="New board"
              value={boardName}
            />
            <button title="Create board" type="submit">
              <Plus size={13} />
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
