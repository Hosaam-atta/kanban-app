import { Link } from 'react-router-dom';
import { Button } from '../../shared/components/Button/Button';

export function SettingsPage() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Workspace settings</p>
          <h1>Settings</h1>
        </div>
        <Button as={Link} to="/">
          Back to board
        </Button>
      </header>

      <section className="settings-panel">
        <label>
          Board name
          <input defaultValue="Kanban App" />
        </label>
        <label>
          Default view
          <select defaultValue="board">
            <option value="board">Board</option>
            <option value="list">List</option>
          </select>
        </label>
      </section>
    </main>
  );
}
