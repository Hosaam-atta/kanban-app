import { Plus } from 'lucide-react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { BoardColumn as BoardColumnType } from '../../../entities/board/types';
import type { BoardTask } from '../../../entities/board/types';
import { TaskCard } from '../../tasks/components/TaskCard';
import { TaskModal } from '../../tasks/components/TaskModal';
import { ColumnHeader } from './ColumnHeader';

type BoardColumnProps = {
  column: BoardColumnType;
  onAddTask: (columnId: string, title: string) => BoardTask | undefined;
  onDeleteColumn: (columnId: string) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
  onRenameColumn: (columnId: string, title: string) => void;
  onRenameTask: (columnId: string, taskId: string, title: string) => void;
  onUpdateTaskDetails: (
    columnId: string,
    taskId: string,
    task: BoardTask,
  ) => void;
};

export function BoardColumn({
  column,
  onAddTask,
  onDeleteColumn,
  onDeleteTask,
  onRenameColumn,
  onRenameTask,
  onUpdateTaskDetails,
}: BoardColumnProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState<BoardTask | null>(null);
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `column-drag:${column.id}`,
    data: {
      columnId: column.id,
      type: 'column-drag',
    },
  });
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `column:${column.id}`,
    data: {
      columnId: column.id,
      type: 'column',
    },
  });
  const dragStyle = {
    transform: CSS.Translate.toString(transform),
  };

  function setColumnNodeRef(node: HTMLElement | null) {
    setDraggableRef(node);
    setDroppableRef(node);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const task = onAddTask(column.id, taskTitle);

    if (task) {
      setSelectedTask(task);
    }

    setTaskTitle('');
  }

  return (
    <article
      className={[
        'column',
        isOver ? 'column-drop-active' : '',
        isDragging ? 'column-dragging' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      ref={setColumnNodeRef}
      style={dragStyle}
    >
      <ColumnHeader
        dragAttributes={attributes}
        dragListeners={listeners}
        onDelete={() => onDeleteColumn(column.id)}
        onRename={(title) => onRenameColumn(column.id, title)}
        title={column.title}
        taskCount={column.tasks.length}
      />
      <div className="card-list">
        {column.tasks.map((task) => (
          <TaskCard
            columnId={column.id}
            key={task.id}
            onDelete={() => onDeleteTask(column.id, task.id)}
            onOpen={() => setSelectedTask(task)}
            onRename={(title) => onRenameTask(column.id, task.id, title)}
            task={task}
          />
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

      {selectedTask ? (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={(updatedTask) =>
            onUpdateTaskDetails(column.id, selectedTask.id, updatedTask)
          }
        />
      ) : null}
    </article>
  );
}
