export function SettingsPage() {
  return (
    <main>
      <header className="topbar">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>Settings</h1>
        </div>
      </header>

      <section className="settings-panel">
        <label>
          Board name
          <input defaultValue="Team board" />
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
