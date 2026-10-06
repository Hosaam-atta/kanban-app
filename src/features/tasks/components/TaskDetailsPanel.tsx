import type {
  BoardTask,
  TaskPriority,
  TaskStatus,
} from '../../../entities/board/types';

type TaskDetailsPanelProps = {
  draftTask: BoardTask;
  onChange: (task: BoardTask) => void;
};

const priorityOptions: Array<{ label: string; value: TaskPriority }> = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];

const statusOptions: Array<{ label: string; value: TaskStatus }> = [
  { label: 'To do', value: 'todo' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
];

export function TaskDetailsPanel({
  draftTask,
  onChange,
}: TaskDetailsPanelProps) {
  return (
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
        Description
        <textarea
          onChange={(event) =>
            onChange({
              ...draftTask,
              description: event.target.value,
            })
          }
          placeholder="Add task notes, scope, or context"
          value={draftTask.description ?? ''}
        />
      </label>

      <label className="task-details-field">
        Priority
        <select
          onChange={(event) =>
            onChange({
              ...draftTask,
              priority: event.target.value as TaskPriority,
            })
          }
          value={draftTask.priority ?? 'medium'}
        >
          {priorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="task-details-field">
        Status
        <select
          onChange={(event) =>
            onChange({
              ...draftTask,
              status: event.target.value as TaskStatus,
            })
          }
          value={draftTask.status ?? 'todo'}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
  );
}
