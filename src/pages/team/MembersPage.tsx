const members = [
  {
    name: 'Workspace Owner',
    email: 'owner@example.com',
    role: 'Owner',
  },
  {
    name: 'Product Lead',
    email: 'lead@example.com',
    role: 'Lead',
  },
];

export function MembersPage() {
  return (
    <main>
      <header className="topbar">
        <div>
          <p className="eyebrow">Team</p>
          <h1>Members</h1>
        </div>
        <button className="button" type="button">
          Invite member
        </button>
      </header>

      <section className="content-panel" aria-label="Workspace members">
        <div className="table-list">
          {members.map((member) => (
            <article className="table-row" key={member.email}>
              <div>
                <strong>{member.name}</strong>
                <span>{member.email}</span>
              </div>
              <span className="badge">{member.role}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
