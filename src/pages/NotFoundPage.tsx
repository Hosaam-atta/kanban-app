import { Link } from 'react-router-dom';
import { Button } from '../shared/components/Button/Button';

export function NotFoundPage() {
  return (
    <main className="centered-page">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <Button as={Link} to="/">
        Go home
      </Button>
    </main>
  );
}
