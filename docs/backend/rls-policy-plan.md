# RLS Policy Plan

This is the planned Row Level Security direction. It is not a migration yet.

## Security Rules

- Enable RLS on every table exposed through the public schema.
- Use `TO authenticated` plus row ownership or workspace membership predicates.
- Never rely on `TO authenticated` alone.
- Do not use user-editable metadata for authorization.
- UI role visibility is only UX; database policies are the source of truth.
- UPDATE policies need both `USING` and `WITH CHECK`.
- Sensitive multi-step flows should use database functions or Edge Functions after review.

## Access Helpers

Planned helper concepts:

- User is workspace member.
- User has workspace permission.
- User can read workspace.
- User can write board.
- User can write task.
- User can manage members.

Helper implementation must be reviewed carefully. Avoid `SECURITY DEFINER` unless there is a strong reason and the function is locked down.

## Initial Policy Direction

### profiles

- User can read their own profile.
- Workspace members may later read limited public profile fields for other members in shared workspaces.
- User can update their own non-authorization profile fields.

### user_settings

- User can read their own settings.
- User can update their own settings.

### workspaces

- User can read workspaces where they are a member.
- User can create personal or team workspaces.
- Only allowed roles can update workspace details.
- Soft delete requires owner-level permission.

### workspace_members

- User can read memberships for workspaces they belong to.
- Owner or allowed role can invite or change members.
- Last owner cannot be removed without ownership transfer.

### boards

- Workspace members can read active boards in the workspace.
- Lead/editor/owner can create or update boards.
- Viewer cannot mutate boards.

### board_columns

- Workspace members can read active columns for readable boards.
- Lead/editor/owner can create, update, move, or soft-delete columns.

### tasks

- Workspace members can read active tasks for readable boards.
- Lead/editor/owner can create and update tasks.
- Viewer cannot mutate tasks.
- Updates must preserve workspace ownership and valid board/column relationships.

## Testing Requirements Later

Each policy group should be tested for:

- User outside workspace cannot read rows.
- Viewer cannot write.
- Editor can write allowed task/board data.
- Last owner protection works.
- Soft-deleted rows are hidden from normal reads.
- Cross-workspace writes are rejected.
