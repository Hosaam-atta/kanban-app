const invitations = [
  {
    email: 'designer@example.com',
    role: 'Editor',
    status: 'Pending',
  },
];

export function InvitationsPage() {
  return (
    <main>
      <header className="topbar">
        <div>
          <p className="eyebrow">Team</p>
          <h1>Invitations</h1>
        </div>
      </header>

      <section className="content-panel" aria-label="Workspace invitations">
        <div className="table-list">
          {invitations.map((invitation) => (
            <article className="table-row" key={invitation.email}>
              <div>
                <strong>{invitation.email}</strong>
                <span>{invitation.role}</span>
              </div>
              <span className="badge">{invitation.status}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
