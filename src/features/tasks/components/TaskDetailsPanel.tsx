import { useState } from 'react';
import type { BoardTask } from '../../../entities/board/types';

type TaskDetailsPanelProps = {
  draftTask: BoardTask;
  onChange: (task: BoardTask) => void;
};

function parseLabels(value: string) {
  return value
    .split(',')
    .map((label) => label.trim())
    .filter(Boolean);
}

export function TaskDetailsPanel({
  draftTask,
  onChange,
}: TaskDetailsPanelProps) {
  const [labelsInput, setLabelsInput] = useState(
    draftTask.labels?.join(', ') ?? '',
  );

  return (
    <div className="task-details-layout">
      <div className="task-details-grid">
        <label className="task-details-field task-details-field-wide">
          Title
          <input
            onChange={(event) =>
              onChange({
                ...draftTask,
                title: event.target.value,
              })
            }
            value={draftTask.title}
          />
        </label>

        <label className="task-details-field task-details-field-wide">
          Labels
          <input
            onChange={(event) => {
              setLabelsInput(event.target.value);
              onChange({
                ...draftTask,
                labels: parseLabels(event.target.value),
              });
            }}
            placeholder="Frontend, Hosaam, API"
            value={labelsInput}
          />
          <small>
            Owner controlled labels for task area, ownership, or work type.
          </small>
        </label>

        <label className="task-details-field">
          Due date
          <input
            onChange={(event) =>
              onChange({
                ...draftTask,
                dueDate: event.target.value,
              })
            }
            type="date"
            value={draftTask.dueDate ?? ''}
          />
        </label>

        <label className="task-details-field">
          Assignee
          <input
            onChange={(event) =>
              onChange({
                ...draftTask,
                assignee: event.target.value,
              })
            }
            placeholder="Unassigned"
            value={draftTask.assignee ?? ''}
          />
        </label>
      </div>

      <aside className="task-description-note" aria-label="Task note">
        <div>
          <p className="eyebrow">Description note</p>
          <h3>Task context</h3>
        </div>
        <textarea
          onChange={(event) =>
            onChange({
              ...draftTask,
              description: event.target.value,
            })
          }
          placeholder="Write the task brief, notes, acceptance hints, or context here."
          value={draftTask.description ?? ''}
        />
      </aside>
    </div>
  );
}
