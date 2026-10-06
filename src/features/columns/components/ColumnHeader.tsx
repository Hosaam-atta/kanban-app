import { Check, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

type ColumnHeaderProps = {
  title: string;
  taskCount: number;
  onDelete: () => void;
  onRename: (title: string) => void;
};

export function ColumnHeader({
  onDelete,
  onRename,
  taskCount,
  title,
}: ColumnHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onRename(draftTitle);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <form className="column-title-form" onSubmit={handleSubmit}>
        <input
          aria-label="Column title"
          onChange={(event) => setDraftTitle(event.target.value)}
          value={draftTitle}
        />
        <button title="Save column name" type="submit">
          <Check size={14} />
        </button>
        <button
          onClick={() => {
            setDraftTitle(title);
            setIsEditing(false);
          }}
          title="Cancel"
          type="button"
        >
          <X size={14} />
        </button>
      </form>
    );
  }

  return (
    <div className="column-header">
      <h2>{title}</h2>
      <div className="column-actions">
        <span>{taskCount}</span>
        <button
          onClick={() => setIsEditing(true)}
          title="Edit column name"
          type="button"
        >
          <Pencil size={14} />
        </button>
        <button onClick={onDelete} title="Delete column" type="button">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
