import {
  Check,
  ChevronDown,
  Pencil,
  Plus,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import type { WorkspaceSummary } from '../../../entities/workspace/types';
import { useBoardStore } from '../../../store/board.store';
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
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const createBoard = useWorkspaceStore((state) => state.createBoard);
  const updateWorkspace = useWorkspaceStore((state) => state.updateWorkspace);
  const deleteWorkspace = useWorkspaceStore((state) => state.deleteWorkspace);
  const deleteWorkspaceContent = useBoardStore(
    (state) => state.deleteWorkspaceContent,
  );
  const [boardsOpen, setBoardsOpen] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [boardName, setBoardName] = useState('');
  const clickTimerRef = useRef<number | null>(null);
  const canDeleteWorkspace = workspaces.length > 1;

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

  function handleRenameWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateWorkspace({
      workspaceId: workspace.id,
      name: workspaceName,
    });
    setIsEditing(false);
  }

  function handleDeleteWorkspace() {
    const nextWorkspace = deleteWorkspace({
      workspaceId: workspace.id,
    });

    if (!nextWorkspace) {
      return;
    }

    deleteWorkspaceContent(workspace.id);
    navigate(
      `/workspaces/${nextWorkspace.id}/boards/${
        nextWorkspace.boards[0]?.id ?? 'main'
      }`,
    );
  }

  function handleWorkspaceClick() {
    clickTimerRef.current = window.setTimeout(() => {
      setBoardsOpen((isOpen) => !isOpen);
      clickTimerRef.current = null;
    }, 180);
  }

  function handleWorkspaceDoubleClick() {
    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }

    setActionsVisible(true);
  }

  return (
    <div className="workspace-tree">
      {isEditing ? (
        <form className="workspace-edit-form" onSubmit={handleRenameWorkspace}>
          <input
            aria-label="Workspace name"
            onChange={(event) => setWorkspaceName(event.target.value)}
            value={workspaceName}
          />
          <button title="Save workspace name" type="submit">
            <Check size={13} />
          </button>
          <button
            onClick={() => {
              setWorkspaceName(workspace.name);
              setIsEditing(false);
            }}
            title="Cancel"
            type="button"
          >
            <X size={13} />
          </button>
        </form>
      ) : (
        <div
          className={
            actionsVisible
              ? 'workspace-row workspace-row-manage'
              : 'workspace-row'
          }
        >
          <button
            aria-controls={`${workspace.id}-boards`}
            aria-expanded={boardsOpen}
            className="workspace-option"
            onDoubleClick={handleWorkspaceDoubleClick}
            onClick={handleWorkspaceClick}
            title="Double click to manage workspace"
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
          {actionsVisible ? (
            <>
              <button
                className="workspace-row-action"
                onClick={() => {
                  setWorkspaceName(workspace.name);
                  setIsEditing(true);
                }}
                title="Edit workspace name"
                type="button"
              >
                <Pencil size={13} />
              </button>
              <button
                className="workspace-row-action"
                disabled={!canDeleteWorkspace}
                onClick={handleDeleteWorkspace}
                title={
                  canDeleteWorkspace
                    ? 'Delete workspace'
                    : 'You need at least one workspace'
                }
                type="button"
              >
                <Trash2 size={13} />
              </button>
              <button
                className="workspace-row-action"
                onClick={() => setActionsVisible(false)}
                title="Hide workspace actions"
                type="button"
              >
                <X size={13} />
              </button>
            </>
          ) : null}
        </div>
      )}

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
