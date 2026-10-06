import type { WorkspaceType } from '../../../entities/workspace/types';

type WorkspaceTypeSelectorProps = {
  value: WorkspaceType;
  onChange: (value: WorkspaceType) => void;
};

const workspaceTypes: Array<{
  value: WorkspaceType;
  title: string;
  description: string;
}> = [
  {
    value: 'personal',
    title: 'Personal',
    description: 'A private workspace for individual boards and tasks.',
  },
  {
    value: 'team',
    title: 'Team',
    description: 'A shared workspace with members, roles, and collaboration.',
  },
];

export function WorkspaceTypeSelector({
  onChange,
  value,
}: WorkspaceTypeSelectorProps) {
  return (
    <div
      className="type-selector"
      role="radiogroup"
      aria-label="Workspace type"
    >
      {workspaceTypes.map((type) => (
        <button
          aria-checked={value === type.value}
          className={
            value === type.value
              ? 'type-option type-option-active'
              : 'type-option'
          }
          key={type.value}
          onClick={() => onChange(type.value)}
          role="radio"
          type="button"
        >
          <strong>{type.title}</strong>
          <span>{type.description}</span>
        </button>
      ))}
    </div>
  );
}
