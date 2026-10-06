import { Link } from 'react-router-dom';

type BoardHeaderProps = {
  boardName: string;
  workspaceName: string;
};

export function BoardHeader({ boardName, workspaceName }: BoardHeaderProps) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Active board</p>
        <h1>{boardName}</h1>
        <p className="page-copy">{workspaceName}</p>
      </div>
      <Link className="button button-secondary" to="/workspaces">
        Change workspace
      </Link>
    </header>
  );
}
