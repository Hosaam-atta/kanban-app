import { Link, useNavigate, useParams } from 'react-router-dom';
import { BoardHeader } from '../../features/boards/components/BoardHeader';
import { BoardToolbar } from '../../features/boards/components/BoardToolbar';
import { BoardColumn } from '../../features/columns/components/BoardColumn';
import { useBoardStore } from '../../store/board.store';
import { useWorkspaceStore } from '../../store/workspace.store';

export function BoardPage() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const { boardId } = useParams();
  const getWorkspaceById = useWorkspaceStore((state) => state.getWorkspaceById);
  const getBoardById = useWorkspaceStore((state) => state.getBoardById);
  const updateBoard = useWorkspaceStore((state) => state.updateBoard);
  const deleteBoard = useWorkspaceStore((state) => state.deleteBoard);
  const getBoardContent = useBoardStore((state) => state.getBoardContent);
  const deleteBoardContent = useBoardStore((state) => state.deleteBoardContent);
  const addColumn = useBoardStore((state) => state.addColumn);
  const addTask = useBoardStore((state) => state.addTask);
  const updateColumn = useBoardStore((state) => state.updateColumn);
  const deleteColumn = useBoardStore((state) => state.deleteColumn);
  const updateTask = useBoardStore((state) => state.updateTask);
  const updateTaskDetails = useBoardStore((state) => state.updateTaskDetails);
  const deleteTask = useBoardStore((state) => state.deleteTask);
  useWorkspaceStore((state) => state.workspaces);
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
      <BoardHeader
        boardName={board.name}
        canDeleteBoard={workspace.boards.length > 1}
        onDeleteBoard={() => {
          const nextBoard = deleteBoard({
            workspaceId: workspace.id,
            boardId: board.id,
          });

          if (!nextBoard) {
            return;
          }

          deleteBoardContent(workspace.id, board.id);
          navigate(`/workspaces/${workspace.id}/boards/${nextBoard.id}`);
        }}
        onRenameBoard={(name) =>
          updateBoard({
            workspaceId: workspace.id,
            boardId: board.id,
            name,
          })
        }
        workspaceName={workspace.name}
      />
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
            onDeleteColumn={(columnId) =>
              deleteColumn({
                workspaceId: workspace.id,
                boardId: board.id,
                columnId,
              })
            }
            onDeleteTask={(columnId, taskId) =>
              deleteTask({
                workspaceId: workspace.id,
                boardId: board.id,
                columnId,
                taskId,
              })
            }
            onRenameColumn={(columnId, title) =>
              updateColumn({
                workspaceId: workspace.id,
                boardId: board.id,
                columnId,
                title,
              })
            }
            onRenameTask={(columnId, taskId, title) =>
              updateTask({
                workspaceId: workspace.id,
                boardId: board.id,
                columnId,
                taskId,
                title,
              })
            }
            onUpdateTaskDetails={(columnId, taskId, task) =>
              updateTaskDetails({
                workspaceId: workspace.id,
                boardId: board.id,
                columnId,
                taskId,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate,
                assignee: task.assignee,
              })
            }
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
