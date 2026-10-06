import { ChevronDown, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WorkspaceList } from './WorkspaceList';

export function WorkspaceSidebar() {
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(true);

  return (
    <section className="workspace-switcher" aria-label="Current workspace">
      <div className="workspace-switcher-header">
        <button
          aria-controls="workspace-navigation"
          aria-expanded={workspaceMenuOpen}
          className="workspace-toggle"
          onClick={() => setWorkspaceMenuOpen((isOpen) => !isOpen)}
          type="button"
        >
          <span className="sidebar-section-label">Workspace</span>
          <ChevronDown
            className={
              workspaceMenuOpen
                ? 'sidebar-chevron sidebar-chevron-open'
                : 'sidebar-chevron'
            }
            size={16}
          />
        </button>

        <Link
          aria-label="Create new workspace"
          className="workspace-add-button"
          title="Create new workspace"
          to="/workspaces/new"
        >
          <Plus size={14} />
        </Link>
      </div>

      {workspaceMenuOpen ? <WorkspaceList /> : null}
    </section>
  );
}
