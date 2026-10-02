import { Link } from 'react-router-dom';
import { Button } from '../shared/components/Button/Button';

const columns = [
  {
    title: 'Backlog',
    cards: ['Create project structure', 'Define feature modules'],
  },
  {
    title: 'In Progress',
    cards: ['Wire app shell'],
  },
  {
    title: 'Done',
    cards: ['Initialize Vite setup'],
  },
];

export function BoardPage() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Kanban workspace</p>
          <h1>Project board</h1>
        </div>
        <Button as={Link} to="/settings">
          Settings
        </Button>
      </header>

      <section className="board" aria-label="Kanban board">
        {columns.map((column) => (
          <article className="column" key={column.title}>
            <h2>{column.title}</h2>
            <div className="card-list">
              {column.cards.map((card) => (
                <div className="task-card" key={card}>
                  {card}
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
