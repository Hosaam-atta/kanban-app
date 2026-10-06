import { Link, useParams } from 'react-router-dom';
import { BoardHeader } from '../../features/boards/components/BoardHeader';
import { BoardToolbar } from '../../features/boards/components/BoardToolbar';
import { BoardColumn } from '../../features/columns/components/BoardColumn';
import { useBoardStore } from '../../store/board.store';
import { useWorkspaceStore } from '../../store/workspace.store';

export function BoardPage() {
  const { workspaceId } = useParams();
  const { boardId } = useParams();
  const getWorkspaceById = useWorkspaceStore((state) => state.getWorkspaceById);
  const getBoardById = useWorkspaceStore((state) => state.getBoardById);
  const getBoardContent = useBoardStore((state) => state.getBoardContent);
  const addColumn = useBoardStore((state) => state.addColumn);
  const addTask = useBoardStore((state) => state.addTask);
  useBoardStore((state) => state.boards);
  const workspace = workspaceId ? getWorkspaceById(workspaceId) : undefined;
  const board =
    workspaceId && boardId ? getBoardById(workspaceId, boardId) : undefined;

  if (!workspace || !board) {
    return (
      <main>
        <section className="empty-state">
          <h1>Board not found</h1>
          <p className="page-copy">
            This board may have been moved, deleted, or opened from an old link.
          </p>
          <Link className="button" to="/workspaces">
            Back to workspaces
          </Link>
        </section>
      </main>
    );
  }

  const boardContent = getBoardContent(workspace.id, board.id);

  return (
    <main>
      <BoardHeader boardName={board.name} workspaceName={workspace.name} />
      <BoardToolbar
        onAddColumn={(title) =>
          addColumn({
            workspaceId: workspace.id,
            boardId: board.id,
            title,
          })
        }
      />

      <section className="board" aria-label="Kanban board">
        {boardContent.columns.map((column) => (
          <BoardColumn
            column={column}
            key={column.id}
            onAddTask={(columnId, title) =>
              addTask({
                workspaceId: workspace.id,
                boardId: board.id,
                columnId,
                title,
              })
            }
          />
        ))}
      </section>
    </main>
  );
}
