import { CreateWorkspaceMenu } from '../../features/workspaces/components/CreateWorkspaceMenu';
import { Link } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/workspace.store';

export function WorkspacePage() {
  const workspaces = useWorkspaceStore((state) => state.workspaces);

  return (
    <main>
      <header className="topbar">
        <div>
          <p className="eyebrow">Workspaces</p>
          <h1>Choose where to work</h1>
        </div>
        <CreateWorkspaceMenu />
      </header>

      <section className="workspace-grid" aria-label="Available workspaces">
        {workspaces.map((workspace) => (
          <Link
            className="workspace-card"
            key={workspace.id}
            to={`/workspaces/${workspace.id}/boards/${workspace.boards[0]?.id ?? 'main'}`}
          >
            <div className="workspace-card-header">
              <span className="workspace-avatar">
                {workspace.name.charAt(0)}
              </span>
              <span className="badge">
                {workspace.type === 'team' ? 'Team' : 'Personal'}
              </span>
            </div>
            <h2>{workspace.name}</h2>
            <p>{workspace.description}</p>
            <small>
              {workspace.memberCount}{' '}
              {workspace.memberCount === 1 ? 'member' : 'members'}
            </small>
          </Link>
        ))}
      </section>
    </main>
  );
}
