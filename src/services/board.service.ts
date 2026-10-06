import type { BoardColumn, BoardContent } from '../entities/board/types';

const defaultColumns: BoardColumn[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    tasks: [
      {
        id: 'task-requirements',
        title: 'Review task requirements',
      },
      {
        id: 'task-planning',
        title: 'Prepare board workflow',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      {
        id: 'task-navigation',
        title: 'Design board navigation',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      {
        id: 'task-repository',
        title: 'Connect project repository',
      },
    ],
  },
];

function cloneColumns(columns: BoardColumn[]) {
  return columns.map((column) => ({
    ...column,
    tasks: column.tasks.map((task) => ({ ...task })),
  }));
}

export function createInitialBoardContent(
  workspaceId: string,
  boardId: string,
): BoardContent {
  return {
    id: `${workspaceId}:${boardId}`,
    workspaceId,
    boardId,
    columns: cloneColumns(defaultColumns),
  };
}
