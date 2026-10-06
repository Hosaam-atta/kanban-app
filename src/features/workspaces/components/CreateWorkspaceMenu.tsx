import { Link } from 'react-router-dom';

export function CreateWorkspaceMenu() {
  return (
    <Link className="button" to="/workspaces/new">
      New workspace
    </Link>
  );
}
