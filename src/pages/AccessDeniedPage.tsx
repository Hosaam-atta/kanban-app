import { Link } from 'react-router-dom';
import { Button } from '../shared/components/Button/Button';

export function AccessDeniedPage() {
  return (
    <main className="centered-page">
      <p className="eyebrow">Access denied</p>
      <h1>You do not have permission to view this page</h1>
      <p className="page-copy">
        Ask a workspace owner to update your role if you need access.
      </p>
      <Button as={Link} to="/">
        Back to board
      </Button>
    </main>
  );
}
