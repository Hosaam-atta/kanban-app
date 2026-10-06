# Database Schema Plan

This is the planned first backend schema. It is not a migration yet.

## Design Principles

- Use UUID primary keys.
- Use foreign keys intentionally.
- Enable RLS on every exposed table.
- Avoid trusting client-provided ownership fields.
- Use soft delete for recoverable product data.
- Add indexes based on real access patterns.
- Use transactions or RPC/Edge Functions for sensitive multi-step operations.
- Do not duplicate Supabase-managed `auth.users`, auth sessions, or OTP tables.

## Phase 1 Tables

### profiles

Represents application-level user profile data for `auth.users`.

Main fields:

- `id uuid primary key references auth.users(id)`
- `display_name text`
- `avatar_url text`
- `created_at timestamptz`
- `updated_at timestamptz`

Notes:

- Authorization identity is the permanent user ID, not email.
- Do not use user-editable metadata for authorization.

### user_settings

Stores per-user preferences.

Main fields:

- `user_id uuid primary key references profiles(id)`
- `theme text`
- `compact_mode boolean`
- `created_at timestamptz`
- `updated_at timestamptz`

### workspaces

Represents personal or team workspaces.

Main fields:

- `id uuid primary key`
- `type text`
- `name text`
- `slug text`
- `created_by uuid references profiles(id)`
- `created_at timestamptz`
- `updated_at timestamptz`
- `deleted_at timestamptz`
- `deleted_by uuid references profiles(id)`

Workspace types:

- `personal`
- `team`

### workspace_members

Represents user membership inside a workspace.

Main fields:

- `id uuid primary key`
- `workspace_id uuid references workspaces(id)`
- `user_id uuid references profiles(id)`
- `role text`
- `joined_at timestamptz`
- `created_at timestamptz`
- `updated_at timestamptz`

Initial roles:

- `owner`
- `lead`
- `editor`
- `viewer`

Notes:

- Team workspace must always have at least one owner.
- Last owner cannot leave without ownership transfer.

### workspace_settings

Stores workspace-level preferences.

Main fields:

- `workspace_id uuid primary key references workspaces(id)`
- `default_board_id uuid`
- `created_at timestamptz`
- `updated_at timestamptz`

### boards

Represents a Kanban board inside a workspace.

Main fields:

- `id uuid primary key`
- `workspace_id uuid references workspaces(id)`
- `name text`
- `position numeric`
- `created_by uuid references profiles(id)`
- `created_at timestamptz`
- `updated_at timestamptz`
- `deleted_at timestamptz`
- `deleted_by uuid references profiles(id)`

### board_columns

Represents workflow columns inside a board.

Main fields:

- `id uuid primary key`
- `workspace_id uuid references workspaces(id)`
- `board_id uuid references boards(id)`
- `name text`
- `position numeric`
- `created_by uuid references profiles(id)`
- `created_at timestamptz`
- `updated_at timestamptz`
- `deleted_at timestamptz`
- `deleted_by uuid references profiles(id)`

### tasks

Represents a task inside a board column.

Main fields:

- `id uuid primary key`
- `workspace_id uuid references workspaces(id)`
- `board_id uuid references boards(id)`
- `column_id uuid references board_columns(id)`
- `task_number integer`
- `title text`
- `description text`
- `technical_notes text`
- `priority text`
- `due_date timestamptz`
- `position numeric`
- `version integer`
- `created_by uuid references profiles(id)`
- `created_at timestamptz`
- `updated_at timestamptz`
- `deleted_at timestamptz`
- `deleted_by uuid references profiles(id)`

Task priorities:

- `low`
- `medium`
- `high`
- `urgent`

Notes:

- `version` supports optimistic concurrency.
- Human-readable task keys such as `KAN-142` should be derived from workspace or board context plus `task_number`.
- Fractional positioning should avoid rewriting hundreds of tasks during drag and drop.

## Later Tables

- `labels`
- `task_labels`
- `task_assignees`
- `task_checklist_items`
- `task_acceptance_criteria`
- `task_dependencies`
- `comments`
- `attachments`
- `invitations`
- `activity_logs`
- `notifications`
