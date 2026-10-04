# Architecture

The project is organized by app shell, route guards, pages, feature modules, entities, services, stores, libraries, shared UI, configuration, and styling.

- `src/app` contains application wiring, providers, routing, and the query client.
- `src/routes` contains route guards (protected, public, and role-based).
- `src/pages` contains route-level screens grouped by area: auth, workspaces, board, settings, and team.
- `src/features` groups Kanban domain features (auth, workspaces, boards, columns, tasks, drag-drop, team, invitations, realtime, attachments, comments, search, filters, command palette, notifications, activity, docs, settings), each with its own api, components, hooks, schemas, and types.
- `src/entities` holds shared domain entity types (user, workspace, board, task, member, attachment).
- `src/services` holds API service modules per domain.
- `src/store` contains cross-feature UI stores (ui, modal, command palette, preferences) built with Zustand.
- `src/lib` contains infrastructure: the api client, Supabase client, permissions, validation, and utilities.
- `src/shared` contains reusable UI components, hooks, constants, utilities, and types.
- `src/config` contains environment and app configuration.
- `src/styles` contains global styles and themes.
