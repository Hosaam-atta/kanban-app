const activityItems = [
  'Task moved to In Progress',
  'Member role updated',
  'Board settings changed',
];

export function ActivityPage() {
  return (
    <main>
      <header className="topbar">
        <div>
          <p className="eyebrow">Team</p>
          <h1>Activity</h1>
        </div>
      </header>

      <section className="content-panel" aria-label="Workspace activity">
        <div className="timeline-list">
          {activityItems.map((item) => (
            <article className="timeline-item" key={item}>
              <span aria-hidden="true" />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
