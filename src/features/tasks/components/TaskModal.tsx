import { X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { BoardTask } from '../../../entities/board/types';
import { TaskDetailsPanel } from './TaskDetailsPanel';

type TaskModalProps = {
  task: BoardTask;
  onClose: () => void;
  onSave: (task: BoardTask) => void;
};

export function TaskModal({ onClose, onSave, task }: TaskModalProps) {
  const [draftTask, setDraftTask] = useState<BoardTask>(task);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(draftTask);
    onClose();
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <form
        aria-label="Task details"
        className="task-modal"
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
      >
        <header className="task-modal-header">
          <div>
            <p className="eyebrow">Task details</p>
            <h2>{task.title}</h2>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            title="Close task details"
            type="button"
          >
            <X size={18} />
          </button>
        </header>

        <TaskDetailsPanel draftTask={draftTask} onChange={setDraftTask} />

        <footer className="task-modal-footer">
          <button
            className="button button-secondary"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button className="button" type="submit">
            Save changes
          </button>
        </footer>
      </form>
    </div>
  );
}
