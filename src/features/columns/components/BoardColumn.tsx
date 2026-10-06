import { Plus } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { BoardColumn as BoardColumnType } from '../../../entities/board/types';
import { ColumnHeader } from './ColumnHeader';

type BoardColumnProps = {
  column: BoardColumnType;
  onAddTask: (columnId: string, title: string) => void;
};

export function BoardColumn({ column, onAddTask }: BoardColumnProps) {
  const [taskTitle, setTaskTitle] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAddTask(column.id, taskTitle);
    setTaskTitle('');
  }

  return (
    <article className="column">
      <ColumnHeader title={column.title} taskCount={column.tasks.length} />
      <div className="card-list">
        {column.tasks.map((task) => (
          <div className="task-card" key={task.id}>
            {task.title}
          </div>
        ))}
      </div>
      <form className="add-task-form" onSubmit={handleSubmit}>
        <input
          aria-label={`Add task to ${column.title}`}
          placeholder="Add task"
          value={taskTitle}
          onChange={(event) => setTaskTitle(event.target.value)}
        />
        <button className="icon-button" title="Add task" type="submit">
          <Plus size={15} />
        </button>
      </form>
    </article>
  );
}
