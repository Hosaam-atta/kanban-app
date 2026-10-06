type ColumnHeaderProps = {
  title: string;
  taskCount: number;
};

export function ColumnHeader({ taskCount, title }: ColumnHeaderProps) {
  return (
    <div className="column-header">
      <h2>{title}</h2>
      <span>{taskCount}</span>
    </div>
  );
}
