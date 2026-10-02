type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ description, title }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
