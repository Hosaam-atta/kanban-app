import { Plus } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

type BoardToolbarProps = {
  onAddColumn: (title: string) => void;
};

export function BoardToolbar({ onAddColumn }: BoardToolbarProps) {
  const [columnTitle, setColumnTitle] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAddColumn(columnTitle);
    setColumnTitle('');
  }

  return (
    <form
      className="board-toolbar"
      onSubmit={handleSubmit}
      aria-label="Board actions"
    >
      <input
        aria-label="Column title"
        placeholder="New column"
        value={columnTitle}
        onChange={(event) => setColumnTitle(event.target.value)}
      />
      <button className="icon-button" title="Add column" type="submit">
        <Plus size={16} />
      </button>
    </form>
  );
}
