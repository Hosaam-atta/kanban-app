import { Check, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import type { BoardTask } from '../../../entities/board/types';

type TaskCardProps = {
  task: BoardTask;
  onDelete: () => void;
  onOpen: () => void;
  onRename: (title: string) => void;
};

export function TaskCard({ onDelete, onOpen, onRename, task }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onRename(draftTitle);
    setIsEditing(false);
  }

  function stopCardOpen(event: MouseEvent) {
    event.stopPropagation();
  }

  if (isEditing) {
    return (
      <form
        className="task-card task-card-edit"
        onClick={stopCardOpen}
        onSubmit={handleSubmit}
      >
        <input
          aria-label="Task title"
          onChange={(event) => setDraftTitle(event.target.value)}
          value={draftTitle}
        />
        <div className="task-card-actions">
          <button title="Save task" type="submit">
            <Check size={14} />
          </button>
          <button
            onClick={() => {
              setDraftTitle(task.title);
              setIsEditing(false);
            }}
            title="Cancel"
            type="button"
          >
            <X size={14} />
          </button>
        </div>
      </form>
    );
  }

  return (
    <button
      className="task-card task-card-button"
      onClick={onOpen}
      type="button"
    >
      <span>{task.title}</span>
      <div className="task-card-actions" onClick={stopCardOpen}>
        <button
          onClick={() => {
            setDraftTitle(task.title);
            setIsEditing(true);
          }}
          title="Edit task"
          type="button"
        >
          <Pencil size={14} />
        </button>
        <button onClick={onDelete} title="Delete task" type="button">
          <Trash2 size={14} />
        </button>
      </div>
    </button>
  );
}
