import { Check, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';

type BoardHeaderProps = {
  boardName: string;
  canDeleteBoard: boolean;
  onDeleteBoard: () => void;
  onRenameBoard: (name: string) => void;
  workspaceName: string;
};

export function BoardHeader({
  boardName,
  canDeleteBoard,
  onDeleteBoard,
  onRenameBoard,
  workspaceName,
}: BoardHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(boardName);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onRenameBoard(draftName);
    setIsEditing(false);
  }

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Active board</p>
        {isEditing ? (
          <form className="board-title-form" onSubmit={handleSubmit}>
            <input
              aria-label="Board name"
              onChange={(event) => setDraftName(event.target.value)}
              value={draftName}
            />
            <button title="Save board name" type="submit">
              <Check size={16} />
            </button>
            <button
              onClick={() => {
                setDraftName(boardName);
                setIsEditing(false);
              }}
              title="Cancel"
              type="button"
            >
              <X size={16} />
            </button>
          </form>
        ) : (
          <div className="board-title-row">
            <h1>{boardName}</h1>
            <button
              onClick={() => {
                setDraftName(boardName);
                setIsEditing(true);
              }}
              title="Edit board name"
              type="button"
            >
              <Pencil size={16} />
            </button>
            <button
              disabled={!canDeleteBoard}
              onClick={onDeleteBoard}
              title={
                canDeleteBoard
                  ? 'Delete board'
                  : 'You need at least one board in this workspace'
              }
              type="button"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
        <p className="page-copy">{workspaceName}</p>
      </div>
      <Link className="button button-secondary" to="/workspaces">
        Change workspace
      </Link>
    </header>
  );
}
