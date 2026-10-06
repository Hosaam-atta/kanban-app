import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { WorkspaceType } from '../../entities/workspace/types';
import { WorkspaceTypeSelector } from '../../features/workspaces/components/WorkspaceTypeSelector';
import { useWorkspaceStore } from '../../store/workspace.store';

export function CreateWorkspacePage() {
  const navigate = useNavigate();
  const createWorkspace = useWorkspaceStore((state) => state.createWorkspace);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceType, setWorkspaceType] = useState<WorkspaceType>('personal');
  const [error, setError] = useState('');

  function handleCreateWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!workspaceName.trim()) {
      setError('Workspace name is required.');
      return;
    }

    const workspace = createWorkspace({
      name: workspaceName,
      type: workspaceType,
    });

    navigate(`/workspaces/${workspace.id}/boards/${workspace.boards[0].id}`);
  }

  return (
    <main>
      <header className="topbar">
        <div>
          <p className="eyebrow">Workspaces</p>
          <h1>Create workspace</h1>
        </div>
      </header>

      <form
        className="settings-panel"
        aria-label="Create workspace form"
        onSubmit={handleCreateWorkspace}
      >
        <label>
          Workspace name
          <input
            onChange={(event) => {
              setWorkspaceName(event.target.value);
              setError('');
            }}
            placeholder="Personal Workspace"
            value={workspaceName}
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}

        <div className="form-group">
          <p>Workspace type</p>
          <WorkspaceTypeSelector
            value={workspaceType}
            onChange={setWorkspaceType}
          />
        </div>

        <button className="button" type="submit">
          Create workspace
        </button>
      </form>
    </main>
  );
}
