import { Check, Eye, GripVertical, Pencil, Trash2, X } from 'lucide-react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useRef, useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import type { BoardTask } from '../../../entities/board/types';

type TaskCardProps = {
  task: BoardTask;
  columnId: string;
  onDelete: () => void;
  onOpen: () => void;
  onRename: (title: string) => void;
};

export function TaskCard({
  columnId,
  onDelete,
  onOpen,
  onRename,
  task,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const hoverTimerRef = useRef<number | null>(null);
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `task:${task.id}`,
    data: {
      columnId,
      taskId: task.id,
      type: 'task',
    },
  });
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `task-drop:${task.id}`,
    data: {
      columnId,
      taskId: task.id,
      type: 'task',
    },
  });
  const dragStyle = {
    transform: CSS.Translate.toString(transform),
  };

  function setTaskNodeRef(node: HTMLDivElement | null) {
    setDraggableRef(node);
    setDroppableRef(node);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onRename(draftTitle);
    setIsEditing(false);
    setMenuOpen(false);
  }

  function stopCardOpen(event: MouseEvent) {
    event.stopPropagation();
  }

  function clearHoverTimer() {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }

  function handleMouseEnter() {
    clearHoverTimer();
    hoverTimerRef.current = window.setTimeout(() => {
      setMenuOpen(true);
      hoverTimerRef.current = null;
    }, 450);
  }

  function handleMouseLeave() {
    clearHoverTimer();
    setMenuOpen(false);
  }

  function startEditing() {
    setDraftTitle(task.title);
    setIsEditing(true);
    setMenuOpen(false);
  }

  if (isEditing) {
    return (
      <form className="task-card task-card-edit" onSubmit={handleSubmit}>
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
    <div
      className={
        isDragging ? 'task-card-shell task-card-dragging' : 'task-card-shell'
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={setTaskNodeRef}
      style={dragStyle}
    >
      <div className="task-card">
        <button
          className="task-drag-handle"
          title="Drag task"
          type="button"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={14} />
        </button>
        <button
          className="task-card-main"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          type="button"
        >
          <strong>{task.title}</strong>
          {task.labels?.length ? (
            <span className="task-label-list">
              {task.labels.map((label) => (
                <span className="task-label" key={label}>
                  {label}
                </span>
              ))}
            </span>
          ) : null}
        </button>

        {task.description ? (
          <button
            className="task-note-preview"
            onClick={onOpen}
            title="Open task note"
            type="button"
          >
            {task.description}
          </button>
        ) : null}
      </div>

      {menuOpen ? (
        <div
          className="task-card-menu"
          onClick={stopCardOpen}
          role="menu"
          aria-label={`${task.title} actions`}
        >
          <button
            onClick={() => {
              onOpen();
              setMenuOpen(false);
            }}
            role="menuitem"
            title="Open task details"
            type="button"
          >
            <Eye size={14} />
            <span>Details</span>
          </button>
          <button
            onClick={startEditing}
            role="menuitem"
            title="Edit task"
            type="button"
          >
            <Pencil size={14} />
            <span>Edit</span>
          </button>
          <button
            onClick={onDelete}
            role="menuitem"
            title="Delete task"
            type="button"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
          <button
            onClick={() => setMenuOpen(false)}
            role="menuitem"
            title="Hide task menu"
            type="button"
          >
            <X size={14} />
            <span>Close</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
