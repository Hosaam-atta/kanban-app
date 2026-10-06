# Implementation Roadmap

This document defines the full build path for the Kanban collaboration platform. It is the step-by-step order we will follow when implementing the project.

The goal is not to build everything at once. Each phase should produce a stable, reviewable result before moving to the next phase.

## Guiding Rules

- Work on `develop` through focused feature branches.
- Do not work directly on `main`.
- Do not add a dependency until the current phase needs it.
- Keep server state in TanStack Query.
- Keep client UI state in Zustand.
- Do not call backend APIs directly from random UI components.
- Backend authorization and RLS are the source of truth.
- UI role checks are only for user experience.
- Every new table ships in the same migration as its RLS policies and a basic policy test. No table is created without policies.
- Multi-step operations that must succeed or fail together (workspace creation, task number generation, invitation acceptance, profile creation on signup) are implemented in Postgres as RPC functions or triggers, not as sequential frontend calls.
- Every phase should consider loading, empty, error, permission denied, mobile, keyboard, and accessibility states.

## Phase 1 - Backend Foundation

### Goal

Create the Supabase foundation that the application will build on.

### Build

- Supabase project setup.
- Environment variables plan.
- `.env.example`.
- Supabase client file.
- Database migration structure.
- Initial database schema draft.
- Local development workflow: Supabase CLI, local Supabase instance, seed data.
- TypeScript type generation from the database (`supabase gen types`).

### Main Entities

- `profiles`
- `user_settings`
- `workspaces`
- `workspace_members`
- `workspace_settings`
- `boards`
- `board_columns`
- `tasks`

### Output

- Frontend can connect to Supabase safely using public anon credentials.
- No service-role key exists in frontend code.
- First database schema direction is clear.
- Local Supabase runs and generated DB types are available to the frontend.

### Depends On

- Existing project structure.

### Decisions Needed

- Which migration and seed conventions the team will follow.
- Where generated DB types live and when they are regenerated.

### Out of Scope

- Tables for later features (labels, comments, attachments, notifications, invitations, and so on) are added in their own phases.
- No UI work.

### Libraries

- `@supabase/supabase-js`
- Supabase CLI (dev tooling)

## Phase 2 - Authentication Foundation

### Goal

Implement the authentication entry point using Supabase Email OTP.

### Build

- `/auth` login screen.
- `/auth/verify` OTP verification screen.
- Auth service functions.
- Auth feature hooks.
- Session loading state.
- Logout current device.
- Public and protected route behavior.
- Basic auth error states.
- Email template configuration so the email shows the OTP token (Supabase sends a magic link by default).
- Custom SMTP setup plan, required before real users (the built-in email service is heavily rate-limited).

### Output

- User can request an OTP.
- User can verify OTP.
- Authenticated users can enter the protected app.
- Unauthenticated users are redirected to auth.

### Depends On

- Phase 1.

### Decisions Needed

- OTP length and expiry settings.
- Which email provider is used for SMTP.

### Out of Scope

- Profile creation and editing (Phase 3).
- Session management beyond logging out the current device (Phase 3).

### Libraries

- Router (if not already installed).
- Zod and a form library (for example React Hook Form), if the auth forms need them.
- TanStack Query (first server-state usage).

## Phase 3 - Profiles And Session UX

### Goal

Represent authenticated users inside the app and prepare session management UX.

### Build

- `profiles` creation/update flow, with profile creation on signup handled by a Postgres trigger.
- Current user profile query.
- Account settings placeholder.
- Sessions page structure.
- Plan for logging out all devices. Supabase supports signing out the current session, other sessions, or all sessions, but it does not list or revoke individual sessions. Per-session listing would need custom tracking and is not part of this phase.

### Output

- App has a stable current-user model.
- Settings can show account/session-related information.

### Depends On

- Phase 2.
- Phase 4, for the account settings placeholder and sessions page structure (the profile flow itself can start right after Phase 2).

### Decisions Needed

- Whether per-session listing and revoking is needed at all, or whether "log out all devices" is enough.

### Out of Scope

- Full account and security settings (Phase 14).
- Custom session tracking table, unless the decision above says it is needed.

### Libraries

- None expected.

## Phase 4 - App Shell

### Goal

Build the authenticated application frame.

### Build

- Protected layout.
- Sidebar.
- Topbar.
- Mobile navigation behavior.
- Workspace switcher placeholder.
- Command palette placeholder entry.
- Settings/docs navigation.
- Basic CI: install, lint, typecheck, and build on every pull request.

### Output

- Authenticated users see a real product shell.
- Internal routes share one consistent layout.
- Pull requests run automatic lint, typecheck, and build checks.

### Depends On

- Phase 2.

### Decisions Needed

- Whether Arabic and RTL support is planned. Decide now, because it affects layout across the whole app.

### Out of Scope

- Working command palette (Phase 11).
- Test and E2E steps in CI (added later).

### Libraries

- Zustand (first client UI state, such as sidebar open/closed).

## Phase 5 - Workspace Foundation

### Goal

Create the workspace system that all boards and team features depend on.

### Build

- Workspace list.
- Create workspace page.
- Personal vs Team workspace type selector.
- Workspace service layer.
- Workspace queries and mutations.
- Workspace membership basics.
- Empty workspace state.
- Workspace creation implemented as a single Postgres RPC (workspace, owner membership, settings, and default board together).

### Output

- User can create or select a workspace.
- App understands the difference between personal and team workspaces.

### Depends On

- Phase 1.
- Phase 2.
- Phase 4.

### Decisions Needed

- Can a personal workspace be converted into a team workspace later?

### Out of Scope

- Inviting members (Phase 16).
- Role-based UI behavior (Phase 6).

### Libraries

- None expected.

## Phase 6 - Permissions Foundation

### Goal

Create a permission model before team features expand.

### Build

- Role definitions: Owner, Lead, Editor, Viewer.
- Permission map.
- `can()` helper.
- Route and UI permission checks.
- Backend RLS policy review for workspace membership (the policies themselves are written with each table's migration).
- Access denied page/state.
- Vitest setup with first unit tests for the permission map and `can()`.

### Output

- App can reason about permissions without hardcoding roles everywhere.
- Permission-limited users get correct UI feedback.

### Depends On

- Phase 5.

### Decisions Needed

- Can a workspace have more than one Owner, and can ownership be transferred?

### Out of Scope

- Member management UI (Phase 15).
- Full testing foundation (Phase 21).

### Libraries

- Vitest (minimal setup for utility tests).

## Phase 7 - Board Foundation

### Goal

Build the board layer inside a workspace.

### Build

- Board routes.
- Board list or default board behavior.
- Board header.
- Board toolbar.
- Board service layer.
- Board queries and mutations.
- Empty board state.

### Output

- User can open a board inside a workspace.
- Board UI has loading, empty, and error states.

### Depends On

- Phase 5.
- Phase 6.

### Decisions Needed

- Can a workspace have multiple boards, or only one default board?

### Out of Scope

- Columns and tasks (Phases 8 and 9).

### Libraries

- None expected.

## Phase 8 - Columns

### Goal

Allow boards to contain workflow columns.

### Build

- Create column.
- Rename column.
- Delete or archive column rules.
- Column ordering plan, including the `position` column and the ordering strategy (fractional or numeric). The same strategy is reused for tasks in Phase 9.
- Empty column state.
- Column service functions.

### Output

- Boards can display and manage columns.
- Position strategy is fixed before tasks are built.

### Depends On

- Phase 7.

### Decisions Needed

- What happens to the tasks in a column when it is deleted or archived?
- Which position strategy is used and how a new item is placed at the end.

### Out of Scope

- Drag and drop reordering (Phase 13).

### Libraries

- None expected.

## Phase 9 - Tasks CRUD

### Goal

Build the main task management experience.

### Build

- Create task.
- Task card.
- Task details panel or modal.
- Edit task title and description.
- Priority.
- Due date.
- Soft delete.
- Task number generation plan, implemented in Postgres.
- Optimistic concurrency field: `version`.
- Basic handling of stale-version updates: the update is rejected and the user sees a "task changed, reload" message.
- `position` column on tasks, using the strategy decided in Phase 8.

### Output

- User can create, view, edit, and delete tasks.
- Task data belongs to workspace, board, and column.

### Depends On

- Phase 8.

### Decisions Needed

- Is there a trash and restore flow for soft-deleted tasks?

### Out of Scope

- Realtime conflict UX (Phase 20).
- Drag and drop (Phase 13).

### Libraries

- None expected.

## Phase 10 - Task Details Modules

### Goal

Add structured task information without creating one huge form.

### Build

- Technical notes.
- Checklist.
- Acceptance criteria.
- References.
- Labels.
- Assignees.
- Dependencies.

### Output

- Task details are modular and easy to extend.

### Depends On

- Phase 9.
- Phase 6 for assignee/permission behavior.

### Decisions Needed

- How dependency cycles between tasks are prevented.

### Out of Scope

- Search and filtering by these fields (Phase 12).
- Notifications for assignment (Phase 19).

### Libraries

- None expected.

## Phase 11 - Task Action Bar

### Goal

Create the compact action system for task cards and task details.

### Build

- Central task actions config.
- Icons.
- Labels.
- Keywords.
- Shortcut metadata.
- Tooltips.
- Horizontal scroll behavior.
- Keyboard/touch behavior.
- Command palette implementation, reusing the task actions config.

### Output

- Task actions are configuration-driven.
- The same config can be reused by command palette, docs, and shortcut help.
- Command palette is functional.

### Depends On

- Phase 9.
- Phase 10.

### Decisions Needed

- Which global (non-task) commands the command palette includes.

### Out of Scope

- Shortcut help page (Phase 14).

### Libraries

- A command palette library, only if building it manually proves too costly.

## Phase 12 - Search And Filters

### Goal

Help users find and focus on relevant tasks.

### Build

- Search by title.
- Search by description.
- Filter by priority.
- Filter by label.
- Filter by due date.
- Filter by assignee in team workspaces.
- No-results state.

### Output

- Board remains usable as task count grows.

### Depends On

- Phase 9.
- Phase 10.

### Decisions Needed

- How drag and drop behaves while a filter is active (Phase 13 depends on this answer).

### Out of Scope

- Saved filters and advanced query syntax.

### Libraries

- None expected.

## Phase 13 - Drag And Drop

### Goal

Implement the real Kanban movement experience.

### Build

- Add `dnd-kit`.
- Reorder tasks within a column.
- Move tasks between columns.
- Reorder columns.
- Empty column drop support.
- Drag overlay.
- Keyboard drag support.
- Touch support.
- Fractional positioning strategy, implemented on the `position` columns defined in Phases 8 and 9.
- Defined behavior for drag and drop while a filter is active.

### Output

- Tasks and columns can be moved smoothly and accessibly.
- Only final position is persisted.

### Depends On

- Phase 8.
- Phase 9.
- Phase 12, for the active-filter behavior.

### Decisions Needed

- When and how positions are rebalanced if fractional values get too close together.

### Out of Scope

- Realtime sync of moves between users (Phase 20).

### Libraries

- `dnd-kit`

## Phase 14 - Settings And In-App Docs

### Goal

Give users control and help inside the application.

### Build

- Settings layout.
- Appearance settings.
- Account settings.
- Security settings.
- Sessions page, scoped to what Supabase supports (see Phase 3).
- Docs page.
- Static docs content.
- Keyboard shortcuts help.

### Output

- Product feels complete and explainable.
- Users can understand features without external documentation.

### Depends On

- Phase 3.
- Phase 4.
- Phase 11.

### Decisions Needed

- Final scope of the sessions page, based on the Phase 3 decision.

### Out of Scope

- Team and workspace settings (Phase 15).

### Libraries

- None expected.

## Phase 15 - Team Members

### Goal

Enable team workspace collaboration basics.

### Build

- Members page.
- Members list.
- Role selector.
- Member actions.
- Owner protection rules.
- Permission denied states.

### Output

- Team workspaces can manage members and roles.

### Depends On

- Phase 5.
- Phase 6.

### Decisions Needed

- Ownership transfer rules, following the Phase 6 decision.

### Out of Scope

- Inviting new members (Phase 16).

### Libraries

- None expected.

## Phase 16 - Invitations

### Goal

Allow team workspaces to invite new members safely.

### Build

- Email invitation flow, including the email sending mechanism (Edge Function or an email provider).
- Invitation states: pending, accepted, expired, revoked.
- Invitation role.
- Expiration.
- Revocation.
- Atomic accept flow, implemented as a Postgres RPC.

### Output

- Team members can invite users with controlled roles.

### Depends On

- Phase 15.
- Phase 2.

### Decisions Needed

- Invitation expiry duration.
- What happens when the invited email already belongs to an existing user.

### Out of Scope

- Invitation notifications inside the app (Phase 19).

### Libraries

- None expected (email provider SDK only if an Edge Function needs one).

## Phase 17 - Comments And Activity

### Goal

Add collaboration context to tasks and team actions.

### Build

- Task comments.
- Comment permissions.
- Activity log table and service.
- Activity entries for important actions.
- Activity page.

### Output

- Users can discuss tasks.
- Important team actions are auditable.

### Depends On

- Phase 9.
- Phase 15.

### Decisions Needed

- Which actions are logged as important activity.
- Whether comments can be edited or deleted.

### Out of Scope

- Mentions and notifications (Phase 19).
- Live comment updates (Phase 20).

### Libraries

- None expected.

## Phase 18 - Attachments

### Goal

Support secure file attachments.

### Build

- Supabase Storage private bucket.
- Storage bucket policies.
- Attachment metadata table.
- File uploader.
- Attachment list.
- Attachment preview.
- File type validation.
- File size validation.
- Signed URL or authenticated access strategy.

### Output

- Tasks can have secure attachments.

### Depends On

- Phase 9.
- Phase 6.

### Decisions Needed

- Allowed file types and maximum file size.

### Out of Scope

- Virus scanning and image processing.

### Libraries

- None expected.

## Phase 19 - Notifications

### Goal

Notify users about relevant collaboration events.

### Build

- In-app notifications.
- Notification list.
- Read/unread state.
- Task assigned notification.
- Invitation notification.
- Mention/due-date notification plan.
- Email notification plan for later.

### Output

- Users can track important updates.

### Depends On

- Phase 10.
- Phase 15.
- Phase 16.
- Phase 17.

### Decisions Needed

- Which events create notifications by default.

### Out of Scope

- Sending email notifications (plan only).

### Libraries

- None expected.

## Phase 20 - Realtime Collaboration

### Goal

Make team workspaces update live across users.

### Build

- Realtime task changes.
- Realtime comments.
- Workspace presence.
- Task presence.
- Editing indicators.
- Broadcast events for temporary UI state.
- Private authorized channels, with RLS policies on `realtime.messages`.
- Conflict UX for optimistic concurrency failures, extending the basic handling from Phase 9.

### Output

- Team workspaces feel collaborative and live.

### Depends On

- Phase 9.
- Phase 13.
- Phase 15.
- Phase 17.

### Decisions Needed

- How live position changes from other users are applied while someone is dragging.

### Out of Scope

- Offline support.

### Libraries

- None expected (Supabase Realtime is part of `@supabase/supabase-js`).

## Phase 21 - Testing Foundation

### Goal

Add automated quality checks.

### Build

- Vitest (full setup, extending the minimal setup from Phase 6).
- React Testing Library.
- Unit test setup.
- Component test setup.
- Store and utility tests.
- Basic integration tests.

### Output

- Core frontend logic can be tested automatically.

### Depends On

- Stable frontend architecture.

### Decisions Needed

- Coverage expectations, if any.

### Out of Scope

- E2E tests (Phase 22).

### Libraries

- React Testing Library and related test utilities.

## Phase 22 - E2E And Accessibility Testing

### Goal

Verify critical user journeys and accessibility behavior.

### Build

- Playwright.
- Auth journey tests, using the local Supabase email inbox to read OTP codes.
- Workspace journey tests.
- Board/task journey tests.
- Drag/drop critical path tests.
- Accessibility checks with axe where useful.

### Output

- Main user flows can be verified before merge.

### Depends On

- Phase 21.
- Stable app flows.

### Decisions Needed

- Which journeys are mandatory in CI and which run on demand.

### Out of Scope

- Load and performance testing (Phase 25).

### Libraries

- Playwright and an axe integration.

## Phase 23 - CI/CD

### Goal

Make every pull request run the same checks.

### Build

- GitHub Actions workflow, extending the basic CI from Phase 4.
- Install step.
- Lint step.
- Typecheck step.
- Test step.
- Build step.
- Environment variable strategy for CI.

### Output

- Pull requests have automatic quality gates.

### Depends On

- Phase 21.

### Decisions Needed

- Whether E2E tests run on every pull request or only on `develop` and `main`.

### Out of Scope

- Deployment automation (Phase 24).

### Libraries

- None expected.

## Phase 24 - Deployment

### Goal

Deploy the application safely.

### Build

- Vercel or equivalent frontend deployment.
- Supabase environment separation.
- Development, staging, production environment plan.
- Secure environment variables.
- Release checklist.

### Output

- Application can be deployed outside local development.

### Depends On

- Phase 23.

### Decisions Needed

- Hosting provider and domain setup.
- How migrations are applied to staging and production.

### Out of Scope

- Monitoring and error tracking (Phase 25).

### Libraries

- None expected.

## Phase 25 - Monitoring And Production Hardening

### Goal

Prepare the project for real-world operation.

### Build

- Frontend error tracking plan.
- Backend logs review.
- Realtime failure handling.
- API failure monitoring.
- Performance checks.
- Security review.
- Documentation review.

### Output

- Project has a production-readiness path.

### Depends On

- Phase 24.

### Decisions Needed

- Which error tracking tool is used.

### Out of Scope

- New product features.

### Libraries

- Error tracking SDK, depending on the tool chosen.

## Recommended Execution Order

1. Backend Foundation.
2. Authentication Foundation.
3. Profiles And Session UX (profile flow first; account settings and sessions UI after App Shell).
4. App Shell.
5. Workspace Foundation.
6. Permissions Foundation.
7. Board Foundation.
8. Columns.
9. Tasks CRUD.
10. Task Details Modules.
11. Task Action Bar.
12. Search And Filters.
13. Drag And Drop.
14. Settings And In-App Docs.
15. Team Members.
16. Invitations.
17. Comments And Activity.
18. Attachments.
19. Notifications.
20. Realtime Collaboration.
21. Testing Foundation.
22. E2E And Accessibility Testing.
23. CI/CD.
24. Deployment.
25. Monitoring And Production Hardening.

## Phase Completion Checklist

Each phase is complete only when:

- The intended feature or foundation is implemented.
- TypeScript passes.
- Lint passes.
- Build passes.
- Relevant tests pass when test tooling exists.
- RLS policies are written and tested for every table added or changed.
- Migrations are reviewed.
- Database types are regenerated.
- No secrets are committed.
- Loading states are handled.
- Empty states are handled.
- Error states are handled.
- Permission states are handled when relevant.
- Mobile behavior is checked.
- Keyboard behavior is checked.
- Accessibility concerns are reviewed.
- Documentation is updated when the phase changes architecture or workflow.
