# 1. Project Goal

Kanban App helps individuals and small teams organize work visually by creating boards, columns, and cards that can move through a workflow.

The target user is a developer, freelancer, student, or small team member who needs a lightweight task board without complex project-management overhead.

The first usable version should let a user open one board, create and edit cards, move cards between columns, persist the board locally, search tasks, and use the app comfortably on desktop and mobile.

# 2. Project Scope

## MVP

- Single default board.
- Default columns such as Backlog, In Progress, and Done.
- Create, edit, delete, and reorder cards.
- Move cards between columns.
- Persist board data in the browser.
- Basic card fields: title, description, status/column, priority, due date, labels, created/updated timestamps.
- Search and simple filters.
- Basic settings for board preferences.
- Responsive layout.
- Keyboard and screen-reader accessible core flows.
- Error, empty, and confirmation states.
- Lint, formatting, build verification, and focused tests.

## Later / Optional

- Multiple boards.
- Drag and drop with advanced keyboard support if not included in the MVP.
- Attachments and file persistence.
- Card comments or activity history.
- Import/export board data.
- Themes and richer settings.
- Collaboration or backend sync.
- Authentication.
- Notifications and reminders.
- Advanced analytics or reporting.

# 3. Major User Flows

## Open Board

1. User opens the application.
2. App loads persisted board data.
3. If no data exists, app creates a default board with default columns.
4. User sees columns and cards.

Edge cases:

- Storage read fails, so the app shows a recoverable error and loads a safe default.
- Board has no cards, so empty column states are shown.

## Create Card

1. User selects add card in a column.
2. App opens a form or inline editor.
3. User enters a title and optional details.
4. App validates required fields.
5. App creates the card in the selected column.
6. App persists the board and returns focus to the relevant action.

Edge cases:

- Empty title is rejected.
- Very long title is handled without breaking layout.
- Save failure shows an error and preserves entered values.

## Edit Card

1. User opens an existing card.
2. App displays editable card fields.
3. User updates details.
4. App validates and saves changes.
5. App updates timestamps and persists data.

Edge cases:

- Deleted card is no longer available.
- Invalid due date or empty title is rejected.

## Move Card

1. User chooses a card.
2. User moves it to another column or position.
3. App updates card order and column relationship.
4. App persists the new board state.

Edge cases:

- Moving into an empty column works.
- Reordering within the same column keeps stable ordering.

## Search And Filter

1. User enters a search term.
2. App filters visible cards by title and description.
3. User optionally filters by priority, label, or due date state.
4. App displays matching results and clear empty-state messaging.

Edge cases:

- No matches are found.
- Search input is cleared and the full board returns.

## Update Settings

1. User opens Settings.
2. User changes available preferences.
3. App validates and persists preferences.
4. Board reflects the updated preference.

Edge cases:

- Invalid setting values are rejected or reset.
- Settings persistence fails and shows a non-blocking error.

# 4. Core Data Model

## Board

- Responsibility: Represents the workspace that contains columns and cards.
- Main fields: `id`, `name`, `columnIds`, `createdAt`, `updatedAt`.
- Relationships: Has many Columns.

## Column

- Responsibility: Represents a workflow stage.
- Main fields: `id`, `boardId`, `title`, `cardIds`, `position`, `createdAt`, `updatedAt`.
- Relationships: Belongs to one Board and has many Cards.

## Card

- Responsibility: Represents a task or work item.
- Main fields: `id`, `columnId`, `title`, `description`, `priority`, `labelIds`, `dueDate`, `position`, `createdAt`, `updatedAt`.
- Relationships: Belongs to one Column and references Labels.

## Label

- Responsibility: Provides visual categorization for cards.
- Main fields: `id`, `name`, `color`.
- Relationships: Can be assigned to many Cards.

## Settings

- Responsibility: Stores user preferences for the local app.
- Main fields: `theme`, `compactMode`, `showCompleted`, `defaultBoardId`.
- Relationships: Applies globally to the app.

## Attachment

- Responsibility: Represents a future file or link attached to a card.
- Main fields: `id`, `cardId`, `name`, `type`, `size`, `url`, `createdAt`.
- Relationships: Belongs to one Card.
- MVP status: Optional unless attachments are pulled into the first release.

# 5. Epics

## EPIC-01 - App Foundation And Quality Gates

- Goal: Ensure the project has reliable conventions, scripts, and shared primitives.
- Why it exists: The project needs a stable base before feature work expands.
- Dependencies: Existing initialized project.
- Definition of Done: Scripts pass, formatting is configured, shared utility patterns exist, and documentation explains local workflow.

## EPIC-02 - Board Data And Local Persistence

- Goal: Define the board domain model and persist it locally.
- Why it exists: All board UI depends on predictable state and storage behavior.
- Dependencies: EPIC-01.
- Definition of Done: Board data can initialize, update, persist, recover, and reset safely.

## EPIC-03 - Core Board UI

- Goal: Render the board, columns, cards, and empty states.
- Why it exists: Users need a visible workspace before editing workflows are useful.
- Dependencies: EPIC-02.
- Definition of Done: The board displays persisted data responsively with accessible structure.

## EPIC-04 - Card Management

- Goal: Support creating, editing, deleting, and validating cards.
- Why it exists: Cards are the primary unit of work.
- Dependencies: EPIC-02, EPIC-03.
- Definition of Done: Users can manage card content safely with clear feedback.

## EPIC-05 - Card Movement And Ordering

- Goal: Allow cards to move between columns and positions.
- Why it exists: A Kanban board is useful only when work can progress through states.
- Dependencies: EPIC-03, EPIC-04.
- Definition of Done: Card movement updates UI, state, and persistence without data loss.

## EPIC-06 - Search And Filters

- Goal: Help users find cards quickly.
- Why it exists: Boards become hard to scan as card count grows.
- Dependencies: EPIC-03, EPIC-04.
- Definition of Done: Search and filters work predictably and expose empty states.

## EPIC-07 - Settings And Preferences

- Goal: Provide basic app-level preferences.
- Why it exists: Settings make the app adaptable without blocking core Kanban work.
- Dependencies: EPIC-02.
- Definition of Done: Settings can be changed, persisted, and restored.

## EPIC-08 - Testing And Production Hardening

- Goal: Improve confidence before merging to main.
- Why it exists: The app should remain stable as features are added.
- Dependencies: MVP feature epics.
- Definition of Done: Critical flows are tested and production checks pass.

## EPIC-09 - Later Enhancements

- Goal: Capture improvements that should not block MVP.
- Why it exists: Useful ideas need a place without distracting MVP delivery.
- Dependencies: MVP completion.
- Definition of Done: Enhancement tickets are refined when the MVP is stable.

# 6. Features Inside Each Epic

## EPIC-01 Features

### Code Quality Tooling

- Does: Adds consistent formatting and verification workflow.
- Solves: Reduces noisy diffs and review friction.
- Technical considerations: Use existing ESLint and Prettier scripts.
- Dependencies: None.

### Shared UI Utilities

- Does: Establishes reusable class merging and basic UI component patterns.
- Solves: Keeps UI consistent without overbuilding a design system.
- Technical considerations: Use `clsx` and `tailwind-merge`.
- Dependencies: Tailwind configured.

## EPIC-02 Features

### Domain Types

- Does: Defines Board, Column, Card, Label, and Settings types.
- Solves: Gives all features a common contract.
- Technical considerations: Keep types framework-independent.
- Dependencies: None.

### Zustand Board Store

- Does: Stores board state and exposes mutation actions.
- Solves: Centralizes state changes and avoids prop drilling.
- Technical considerations: Normalize data enough to avoid deeply nested updates.
- Dependencies: Domain types.

### Local Persistence

- Does: Saves and restores board and settings data.
- Solves: Keeps user work after reload.
- Technical considerations: Use versioned localStorage payloads for MVP.
- Dependencies: Zustand store.

## EPIC-03 Features

### Board Layout

- Does: Renders board shell and columns.
- Solves: Gives users a clear workspace.
- Technical considerations: Responsive grid, horizontal scroll on narrow layouts if needed.
- Dependencies: Board store and default data.

### Card Preview

- Does: Renders concise card content.
- Solves: Lets users scan work without opening every card.
- Technical considerations: Truncate long content accessibly.
- Dependencies: Board layout.

### Empty States

- Does: Shows useful empty board and empty column messaging.
- Solves: Prevents blank UI confusion.
- Technical considerations: Empty states should include clear next action.
- Dependencies: Board layout.

## EPIC-04 Features

### Create Card

- Does: Adds a card creation flow.
- Solves: Lets users capture new work.
- Technical considerations: Modal or inline form, validation, focus handling.
- Dependencies: Board layout and store actions.

### Edit Card

- Does: Adds card detail editing.
- Solves: Lets users maintain task details.
- Technical considerations: Reuse validation and form patterns.
- Dependencies: Create card.

### Delete Card

- Does: Removes cards with confirmation.
- Solves: Lets users clean up obsolete work.
- Technical considerations: Avoid accidental deletion.
- Dependencies: Edit card.

## EPIC-05 Features

### Move Card By Controls

- Does: Moves cards between columns using buttons or menus.
- Solves: Gives a simple accessible movement flow before advanced drag and drop.
- Technical considerations: Update card and column order atomically.
- Dependencies: Card management.

### Reorder Cards

- Does: Changes card position inside a column.
- Solves: Lets users prioritize work.
- Technical considerations: Stable ordering and persistence.
- Dependencies: Move controls.

### Drag And Drop

- Does: Adds direct drag interaction.
- Solves: Improves board ergonomics.
- Technical considerations: Only introduce a drag library if this phase needs it.
- Dependencies: Move and reorder logic.

## EPIC-06 Features

### Text Search

- Does: Filters cards by title and description.
- Solves: Helps users find specific work.
- Technical considerations: Derived selectors, debounce only if needed.
- Dependencies: Card data.

### Filters

- Does: Filters cards by priority, labels, and due date status.
- Solves: Helps users focus on relevant work.
- Technical considerations: Keep filter state URL-friendly if needed later.
- Dependencies: Text search.

## EPIC-07 Features

### Settings Page

- Does: Provides preferences UI.
- Solves: Gives users control over app behavior.
- Technical considerations: Keep settings small for MVP.
- Dependencies: Settings store.

### Preference Persistence

- Does: Saves and restores preferences.
- Solves: Keeps user choices across sessions.
- Technical considerations: Share storage utilities with board persistence.
- Dependencies: Settings page.

## EPIC-08 Features

### Unit And Integration Tests

- Does: Tests reducers/actions, utilities, and key UI flows.
- Solves: Prevents regressions.
- Technical considerations: Add testing libraries only when writing tests.
- Dependencies: Stable features.

### Accessibility Review

- Does: Reviews keyboard navigation, labels, focus, and contrast.
- Solves: Makes core flows usable for more users.
- Technical considerations: Manual checks plus automated checks when tooling is added.
- Dependencies: Core UI flows.

### Production Readiness

- Does: Verifies build, lint, formatting, error states, and responsive behavior.
- Solves: Creates a safe merge gate for main.
- Technical considerations: Use PR checklist consistently.
- Dependencies: MVP completion.

## EPIC-09 Features

### Attachments

- Does: Adds file or link attachments to cards.
- Solves: Lets users keep supporting context near tasks.
- Technical considerations: Browser storage limits; consider IndexedDB only when needed.
- Dependencies: Card detail model.

### Multiple Boards

- Does: Supports creating and switching boards.
- Solves: Lets users separate projects.
- Technical considerations: Routing and persistence need careful versioning.
- Dependencies: Single-board MVP.

### Import Export

- Does: Exports and restores board data.
- Solves: Gives users backup and migration.
- Technical considerations: Validate imported JSON before applying.
- Dependencies: Versioned persistence.

# 7. Development Tickets

## KAN-001 - Confirm Tooling And Project Scripts

## Type

chore

## User Story

As a developer, I want reliable project scripts, so that every PR can be checked consistently.

## Description

Verify `dev`, `build`, `lint`, `format`, and `format:check` scripts. Document expected local commands in the README.

## Acceptance Criteria

- README lists setup and verification commands.
- `npm run lint` passes.
- `npm run build` passes.
- `npm run format:check` passes.

## Technical Notes

No new libraries. Keep documentation concise.

## Dependencies

None.

## Can Run in Parallel

Yes, with KAN-002.

## Estimated Complexity

XS

## Testing Requirements

manual testing

## KAN-002 - Add Shared Class Name Utility

## Type

chore

## User Story

As a developer, I want a shared class name utility, so that components can combine Tailwind classes predictably.

## Description

Create a utility that combines `clsx` and `tailwind-merge`.

## Acceptance Criteria

- Utility exists in `src/shared/utils`.
- Utility supports strings, arrays, conditionals, and Tailwind conflict resolution.
- Basic usage is documented or obvious from naming.

## Technical Notes

Likely file: `src/shared/utils/cn.ts`.

## Dependencies

None.

## Can Run in Parallel

Yes, with KAN-001 and KAN-003.

## Estimated Complexity

XS

## Testing Requirements

unit test when test tooling exists, otherwise manual review

## KAN-003 - Define Core Domain Types

## Type

feature

## User Story

As a developer, I want clear domain types, so that board features share the same data contract.

## Description

Define TypeScript types for Board, Column, Card, Label, Priority, and Settings.

## Acceptance Criteria

- Types are exported from feature type folders.
- Required and optional fields are explicit.
- Types do not depend on React components.

## Technical Notes

Use `src/features/boards/types`, `columns/types`, `cards/types`, and `settings/types`.

## Dependencies

None.

## Can Run in Parallel

Yes, with KAN-001 and KAN-002.

## Estimated Complexity

S

## Testing Requirements

TypeScript build

## KAN-004 - Create Default Board Data Factory

## Type

feature

## User Story

As a user, I want the app to start with a usable board, so that I can begin organizing tasks immediately.

## Description

Create utilities that generate a default board, columns, and optional sample-free initial state.

## Acceptance Criteria

- Default board includes Backlog, In Progress, and Done.
- Generated IDs are unique enough for local use.
- Initial data contains no hard-coded demo tasks unless explicitly enabled.

## Technical Notes

Likely file: `src/features/boards/utils/createDefaultBoard.ts`.

## Dependencies

KAN-003.

## Can Run in Parallel

No.

## Estimated Complexity

S

## Testing Requirements

unit test later, TypeScript build now

## KAN-005 - Implement Board Store Actions

## Type

feature

## User Story

As a user, I want board changes to update instantly, so that the app feels responsive.

## Description

Create the Zustand board store with state and actions for initializing board data, adding cards, updating cards, deleting cards, moving cards, and resetting the board.

## Acceptance Criteria

- Store initializes from default board data.
- Store exposes focused actions instead of direct mutation from components.
- Actions preserve column/card relationships.
- Invalid card or column IDs fail safely.

## Technical Notes

Keep state shape simple but avoid deeply nested updates where possible.

## Dependencies

KAN-003, KAN-004.

## Can Run in Parallel

No.

## Estimated Complexity

M

## Testing Requirements

unit test when test tooling exists, manual testing initially

## KAN-006 - Add Versioned Local Persistence

## Type

feature

## User Story

As a user, I want my board to remain after refresh, so that I do not lose work.

## Description

Persist board state in localStorage using a versioned payload and safe fallback behavior.

## Acceptance Criteria

- Board state saves after supported mutations.
- Board state restores on app load.
- Corrupt or incompatible data falls back to default board.
- Storage failures do not crash the app.

## Technical Notes

Use a small storage utility under `src/shared/utils` or board utils.

## Dependencies

KAN-005.

## Can Run in Parallel

Yes, with KAN-007 after store shape is stable.

## Estimated Complexity

M

## Testing Requirements

unit test for storage helpers, manual reload testing

## KAN-007 - Render Board From Store

## Type

feature

## User Story

As a user, I want to see my board columns and cards, so that I can understand current work.

## Description

Replace placeholder board data with state from the board store.

## Acceptance Criteria

- Board page reads columns and cards from the store.
- Empty columns render correctly.
- Loading/default initialization does not flash broken UI.
- Layout remains responsive.

## Technical Notes

Likely components: Board, ColumnList, Column, CardPreview.

## Dependencies

KAN-005.

## Can Run in Parallel

Yes, with KAN-006.

## Estimated Complexity

M

## Testing Requirements

manual testing, integration test later

## KAN-008 - Build Reusable Empty State Component Usage

## Type

feature

## User Story

As a user, I want clear empty states, so that I know what to do next.

## Description

Use the shared EmptyState component for empty board, empty column, and no search result states.

## Acceptance Criteria

- Empty columns show helpful text.
- Empty board state provides a clear next action.
- Empty states are accessible and do not shift layout unexpectedly.

## Technical Notes

Avoid marketing copy. Keep messages practical.

## Dependencies

KAN-007.

## Can Run in Parallel

No.

## Estimated Complexity

S

## Testing Requirements

manual testing

## KAN-009 - Create Add Card Flow

## Type

feature

## User Story

As a user, I want to create a card in a column, so that I can capture new work.

## Description

Add an accessible card creation form for a selected column.

## Acceptance Criteria

- User can open add-card UI from each column.
- User can enter a title and optional description.
- Empty titles are rejected.
- New card appears in the selected column.
- Form closes or resets after successful creation.
- Keyboard focus returns to the add-card trigger or new card.

## Technical Notes

Use existing shared Button/Input patterns. Consider Modal only if detail fields need space.

## Dependencies

KAN-005, KAN-007.

## Can Run in Parallel

No.

## Estimated Complexity

M

## Testing Requirements

manual testing, integration test later

## KAN-010 - Add Card Detail And Edit Flow

## Type

feature

## User Story

As a user, I want to edit a card, so that task information stays accurate.

## Description

Add card detail UI with editable title, description, priority, due date, and labels.

## Acceptance Criteria

- User can open a card detail view.
- Existing card data is displayed.
- User can edit supported fields.
- Invalid title is rejected.
- Save updates the card and persists changes.
- Cancel preserves the previous card state.

## Technical Notes

Focus trapping is needed if using a modal. Labels can be basic for MVP.

## Dependencies

KAN-009.

## Can Run in Parallel

No.

## Estimated Complexity

M

## Testing Requirements

manual testing, integration test later

## KAN-011 - Add Delete Card Flow

## Type

feature

## User Story

As a user, I want to delete obsolete cards, so that my board stays clean.

## Description

Add a guarded delete action from the card detail UI.

## Acceptance Criteria

- User can delete a card from detail view.
- Delete requires confirmation.
- Deleted card is removed from its column.
- Card detail UI closes after deletion.
- Focus returns to a logical nearby element.

## Technical Notes

Use accessible confirmation UI. Avoid browser `confirm` if a reusable modal exists.

## Dependencies

KAN-010.

## Can Run in Parallel

No.

## Estimated Complexity

S

## Testing Requirements

manual testing

## KAN-012 - Move Card Between Columns With Controls

## Type

feature

## User Story

As a user, I want to move a card between columns, so that I can update its workflow status.

## Description

Add menu or button controls to move a card to another column.

## Acceptance Criteria

- User can move a card to any other column.
- Moving into an empty column works.
- Card is removed from previous column.
- Card appears in the target column.
- Move is persisted after refresh.

## Technical Notes

This is the accessible baseline before drag and drop.

## Dependencies

KAN-005, KAN-010.

## Can Run in Parallel

No.

## Estimated Complexity

M

## Testing Requirements

manual testing, unit test for move action

## KAN-013 - Reorder Cards With Controls

## Type

feature

## User Story

As a user, I want to change card order, so that important work appears first.

## Description

Add move up/down controls for cards within a column.

## Acceptance Criteria

- User can move a card up or down in the same column.
- First card cannot move up.
- Last card cannot move down.
- Order persists after refresh.
- Controls have accessible labels.

## Technical Notes

Keep ordering logic reusable for later drag and drop.

## Dependencies

KAN-012.

## Can Run in Parallel

No.

## Estimated Complexity

S

## Testing Requirements

unit test for reorder action, manual testing

## KAN-014 - Add Text Search

## Type

feature

## User Story

As a user, I want to search cards by text, so that I can find tasks quickly.

## Description

Add search input and filter displayed cards by title and description.

## Acceptance Criteria

- Search filters cards by title.
- Search filters cards by description.
- Search is case-insensitive.
- Clearing search restores all cards.
- No-match state is shown when appropriate.

## Technical Notes

Use derived data rather than mutating the store.

## Dependencies

KAN-007.

## Can Run in Parallel

Yes, with KAN-010 after board rendering is stable.

## Estimated Complexity

S

## Testing Requirements

manual testing, unit test for filter utility

## KAN-015 - Add Basic Card Filters

## Type

feature

## User Story

As a user, I want to filter cards by attributes, so that I can focus on relevant work.

## Description

Add filters for priority, label, and due date status.

## Acceptance Criteria

- User can filter by priority.
- User can filter by label.
- User can filter by overdue or due soon state.
- Filters combine with text search.
- User can clear all filters.

## Technical Notes

Avoid URL persistence in MVP unless routing needs it later.

## Dependencies

KAN-010, KAN-014.

## Can Run in Parallel

No.

## Estimated Complexity

M

## Testing Requirements

manual testing, unit test for filter utility

## KAN-016 - Implement Settings Store

## Type

feature

## User Story

As a user, I want my preferences saved, so that the app behaves the way I expect.

## Description

Create a small settings store and persistence layer.

## Acceptance Criteria

- Settings have typed defaults.
- Settings can be updated through actions.
- Settings persist after refresh.
- Invalid stored settings fall back safely.

## Technical Notes

Reuse storage patterns from KAN-006.

## Dependencies

KAN-006.

## Can Run in Parallel

Yes, with KAN-014.

## Estimated Complexity

S

## Testing Requirements

manual testing, unit test later

## KAN-017 - Build Settings Page Controls

## Type

feature

## User Story

As a user, I want to change basic settings, so that I can tailor the board experience.

## Description

Replace placeholder settings UI with real controls backed by the settings store.

## Acceptance Criteria

- Settings page reads from settings store.
- User can change supported preferences.
- Changes persist after refresh.
- Controls have accessible labels.

## Technical Notes

Keep MVP settings limited, such as compact mode and show completed cards.

## Dependencies

KAN-016.

## Can Run in Parallel

No.

## Estimated Complexity

S

## Testing Requirements

manual testing

## KAN-018 - Add Responsive Board Polish

## Type

feature

## User Story

As a user, I want the board to work on different screen sizes, so that I can manage tasks from desktop or mobile.

## Description

Refine board layout, card spacing, controls, and text overflow for mobile and desktop.

## Acceptance Criteria

- Board is usable at common mobile widths.
- Text does not overlap or overflow controls.
- Interactive targets are large enough for touch.
- Desktop layout remains scan-friendly.

## Technical Notes

Use Tailwind utilities or existing CSS consistently. Avoid major visual redesign.

## Dependencies

KAN-007, KAN-009, KAN-012.

## Can Run in Parallel

Yes, with KAN-016 after core UI exists.

## Estimated Complexity

M

## Testing Requirements

manual responsive testing

## KAN-019 - Accessibility Pass For Core Flows

## Type

test

## User Story

As a keyboard or assistive technology user, I want core flows to be accessible, so that I can use the app reliably.

## Description

Review keyboard navigation, focus management, accessible names, semantic landmarks, and color contrast for MVP flows.

## Acceptance Criteria

- Create, edit, delete, move, search, and settings flows are keyboard usable.
- Modal or dialog content has correct roles and focus behavior.
- Buttons and icon controls have accessible names.
- Visible focus states are present.
- Contrast issues are fixed.

## Technical Notes

Use manual keyboard testing. Add automated accessibility tooling later only if needed.

## Dependencies

KAN-009 through KAN-018.

## Can Run in Parallel

No.

## Estimated Complexity

M

## Testing Requirements

manual accessibility testing

## KAN-020 - Add Test Tooling

## Type

chore

## User Story

As a developer, I want test tooling, so that critical behavior can be verified automatically.

## Description

Introduce test tooling for unit and React integration tests.

## Acceptance Criteria

- Test script is available.
- Test environment supports TypeScript and React components.
- Example smoke test passes.
- No unnecessary E2E dependency is introduced yet.

## Technical Notes

Add libraries only in this ticket. Candidate tools: Vitest and Testing Library.

## Dependencies

KAN-001.

## Can Run in Parallel

Yes, with feature tickets if agreed by the team.

## Estimated Complexity

S

## Testing Requirements

test script must pass

## KAN-021 - Add Store And Utility Tests

## Type

test

## User Story

As a developer, I want store and utility tests, so that data changes remain reliable.

## Description

Test default board generation, create/update/delete/move actions, search filters, and persistence helpers.

## Acceptance Criteria

- Default data tests pass.
- Card CRUD action tests pass.
- Move and reorder tests pass.
- Filter utility tests pass.
- Persistence fallback tests pass.

## Technical Notes

Prioritize business logic over snapshot tests.

## Dependencies

KAN-020, KAN-005, KAN-006, KAN-015.

## Can Run in Parallel

Yes, with KAN-019 after implementation stabilizes.

## Estimated Complexity

M

## Testing Requirements

unit test

## KAN-022 - Add Core Flow Integration Tests

## Type

test

## User Story

As a developer, I want core user flows tested, so that regressions are caught before merge.

## Description

Add tests for creating, editing, deleting, moving, searching, and updating settings.

## Acceptance Criteria

- User can create a card in a test.
- User can edit card details in a test.
- User can delete a card in a test.
- User can move a card in a test.
- User can search and clear search in a test.
- Settings update test passes.

## Technical Notes

Use user-event style interactions where possible.

## Dependencies

KAN-020, KAN-009 through KAN-017.

## Can Run in Parallel

Yes, with KAN-021.

## Estimated Complexity

L

## Testing Requirements

integration test

## KAN-023 - Production Readiness Review

## Type

chore

## User Story

As a maintainer, I want a final MVP quality review, so that develop can safely merge into main.

## Description

Run final checks, review UX edge cases, verify build output, and update release notes or README status.

## Acceptance Criteria

- `npm run lint` passes.
- `npm run build` passes.
- `npm run format:check` passes.
- Tests pass if test tooling exists.
- Manual MVP checklist is complete.
- Known non-MVP items are documented.

## Technical Notes

This is a release gate, not a feature ticket.

## Dependencies

All MVP tickets.

## Can Run in Parallel

No.

## Estimated Complexity

S

## Testing Requirements

manual testing, build, lint, format, automated tests if available

## KAN-024 - Spike Drag And Drop Approach

## Type

spike

## User Story

As a developer, I want to evaluate drag and drop options, so that we choose an accessible and maintainable approach.

## Description

Compare native implementation and a focused drag-and-drop library for card movement.

## Acceptance Criteria

- Recommendation is documented.
- Accessibility tradeoffs are documented.
- Bundle and maintenance considerations are documented.
- No production implementation is added.

## Technical Notes

Do not install a library unless the spike explicitly needs a prototype branch.

## Dependencies

KAN-013.

## Can Run in Parallel

Yes, after card movement is implemented.

## Estimated Complexity

S

## Testing Requirements

manual research

## KAN-025 - Add Drag And Drop Card Movement

## Type

feature

## User Story

As a user, I want to drag cards between columns, so that moving tasks feels fast and natural.

## Description

Implement drag and drop using the approach selected in KAN-024.

## Acceptance Criteria

- User can drag cards within a column.
- User can drag cards across columns.
- Empty-column drop works.
- State persists after refresh.
- Keyboard-accessible fallback remains available.

## Technical Notes

Do not remove move controls. Keep movement logic shared.

## Dependencies

KAN-024.

## Can Run in Parallel

No.

## Estimated Complexity

L

## Testing Requirements

manual testing, integration test if stable

## KAN-026 - Add Import And Export

## Type

feature

## User Story

As a user, I want to export and import board data, so that I can back up or move my work.

## Description

Add JSON export and guarded JSON import.

## Acceptance Criteria

- User can export current board data.
- User can import valid board data.
- Invalid files are rejected with an error.
- Import requires confirmation before replacing current data.

## Technical Notes

Validate imported payload version before applying.

## Dependencies

KAN-006, KAN-023.

## Can Run in Parallel

Yes, after MVP.

## Estimated Complexity

M

## Testing Requirements

unit test for validation, manual testing

## KAN-027 - Add Attachments Spike

## Type

spike

## User Story

As a developer, I want to evaluate attachment storage options, so that files are handled safely.

## Description

Research local attachment storage options and limits.

## Acceptance Criteria

- Storage options are documented.
- Recommended MVP-compatible approach is documented.
- Risks around localStorage and IndexedDB are documented.

## Technical Notes

No attachment implementation in this ticket.

## Dependencies

KAN-023.

## Can Run in Parallel

Yes, after MVP.

## Estimated Complexity

S

## Testing Requirements

manual research

# 8. Recommended Development Order

## Phase 1 - Foundation

- KAN-001
- KAN-002
- KAN-003
- KAN-004

This creates the safe base: scripts, utilities, types, and default data.

## Phase 2 - State And Persistence

- KAN-005
- KAN-006

The board store should exist before UI features start depending on it. Persistence follows once the mutation shape is known.

## Phase 3 - Board Read Experience

- KAN-007
- KAN-008

Rendering comes before editing so developers can visually verify state changes.

## Phase 4 - Card CRUD

- KAN-009
- KAN-010
- KAN-011

Create, edit, and delete build on the same form and validation patterns.

## Phase 5 - Movement And Ordering

- KAN-012
- KAN-013

Accessible movement controls come before drag and drop. This reduces risk and gives users a reliable fallback.

## Phase 6 - Search, Filters, And Settings

- KAN-014
- KAN-015
- KAN-016
- KAN-017

These features depend on stable card data and persistence.

## Phase 7 - UX And Quality

- KAN-018
- KAN-019
- KAN-020
- KAN-021
- KAN-022
- KAN-023

Polish and testing should happen once the MVP flows are present, but test tooling can start earlier if the team wants tighter feedback.

## Phase 8 - Later Enhancements

- KAN-024
- KAN-025
- KAN-026
- KAN-027

These should not block the MVP merge into main.

# 9. Milestones

## Milestone 1 - Foundation

- Goal: Prepare the codebase for predictable feature work.
- Included tickets: KAN-001, KAN-002, KAN-003, KAN-004.
- Exit criteria: Scripts pass, types exist, and default data factory is ready.

## Milestone 2 - Board State And Persistence

- Goal: Make board data functional and durable.
- Included tickets: KAN-005, KAN-006.
- Exit criteria: Board state can initialize, mutate, persist, and recover.

## Milestone 3 - Core Board

- Goal: Render the usable board UI.
- Included tickets: KAN-007, KAN-008.
- Exit criteria: User can see columns, cards, and meaningful empty states.

## Milestone 4 - Card Management

- Goal: Enable card CRUD.
- Included tickets: KAN-009, KAN-010, KAN-011.
- Exit criteria: User can create, edit, and delete cards with validation.

## Milestone 5 - Movement And Organization

- Goal: Let users move and prioritize cards.
- Included tickets: KAN-012, KAN-013.
- Exit criteria: Cards can move across columns and reorder within columns.

## Milestone 6 - Search, Filters, And Settings

- Goal: Add practical productivity controls.
- Included tickets: KAN-014, KAN-015, KAN-016, KAN-017.
- Exit criteria: User can search, filter, and persist basic preferences.

## Milestone 7 - MVP Hardening

- Goal: Prepare develop for merge into main.
- Included tickets: KAN-018, KAN-019, KAN-020, KAN-021, KAN-022, KAN-023.
- Exit criteria: UX, accessibility, build, lint, formatting, and tests are acceptable.

## Milestone 8 - Post-MVP Enhancements

- Goal: Improve the app without delaying the first release.
- Included tickets: KAN-024, KAN-025, KAN-026, KAN-027.
- Exit criteria: Enhancements are validated and implemented only when justified.

# 10. Git Workflow Recommendation

## Branch Naming

- `feature/KAN-009-create-card-flow`
- `fix/KAN-012-move-card-empty-column`
- `chore/KAN-001-project-scripts`
- `test/KAN-021-store-utility-tests`
- `docs/KAN-023-release-notes`
- `spike/KAN-024-dnd-approach`

## Commit Messages

Use Conventional Commit style:

- `feat(cards): add create card flow`
- `fix(board): handle empty column movement`
- `chore(tooling): add format check`
- `test(store): cover card move action`
- `docs(plan): add development backlog`

## Pull Request Strategy

- Open PRs from ticket branches into `develop`.
- Keep PRs scoped to one ticket when practical.
- Use stacked PRs only when dependencies make it necessary.
- Merge to `develop` after review and passing checks.
- Merge `develop` into `main` only at the end of a verified milestone or release.
- Do not commit directly to `main`.

# 11. Pull Request Checklist

- Requirement completed.
- Acceptance criteria verified.
- No TypeScript errors.
- `npm run lint` passes.
- `npm run build` passes.
- `npm run format:check` passes.
- Tests pass when test tooling exists.
- Responsive behavior checked.
- Keyboard navigation checked.
- Accessibility labels and focus behavior checked.
- Empty states handled.
- Error states handled.
- No unnecessary dependencies added.
- No obvious unnecessary re-renders.
- No unrelated refactors included.
- README or docs updated when behavior changes.

# 12. Risks and Common Pitfalls

## Overengineering State Management

Risk: Building a complex normalized architecture before the app needs it.

Reduction: Start with simple Zustand slices and introduce complexity only when update logic becomes painful.

## Deeply Nested State

Risk: Card movement becomes fragile when columns directly contain full card objects.

Reduction: Store card IDs in columns and card data separately if movement logic becomes complex.

## Unnecessary React Re-renders

Risk: Every card re-renders on small board changes.

Reduction: Use focused selectors, stable component props, and avoid deriving large objects inside render.

## Drag-And-Drop Synchronization Bugs

Risk: Drag UI and store order drift apart.

Reduction: Implement move/reorder actions first, then make drag and drop call those actions.

## localStorage Size Limitations

Risk: Large board data or attachments exceed storage limits.

Reduction: Keep attachments out of localStorage and use versioned payloads with graceful errors.

## Storing Files In The Wrong Place

Risk: Binary files in localStorage create performance and quota issues.

Reduction: Treat attachments as post-MVP and evaluate IndexedDB before implementation.

## Accessibility Issues

Risk: Modals, icon buttons, and drag-and-drop exclude keyboard users.

Reduction: Add accessible names, focus management, and movement controls independent of drag and drop.

## Routing And Persistence Inconsistencies

Risk: Future multi-board routes load the wrong persisted board.

Reduction: Keep default board ID explicit and version persistence before adding multiple boards.

## Overusing New Dependencies

Risk: Adding libraries increases bundle size and maintenance.

Reduction: Add dependencies only inside the ticket that needs them and document why.

# 13. Final Backlog

| Order | Ticket  | Type    | Title                                      | Epic    | Dependency                         | Complexity | Status  |
| ----- | ------- | ------- | ------------------------------------------ | ------- | ---------------------------------- | ---------- | ------- |
| 1     | KAN-001 | chore   | Confirm Tooling And Project Scripts        | EPIC-01 | None                               | XS         | Backlog |
| 2     | KAN-002 | chore   | Add Shared Class Name Utility              | EPIC-01 | None                               | XS         | Backlog |
| 3     | KAN-003 | feature | Define Core Domain Types                   | EPIC-02 | None                               | S          | Backlog |
| 4     | KAN-004 | feature | Create Default Board Data Factory          | EPIC-02 | KAN-003                            | S          | Backlog |
| 5     | KAN-005 | feature | Implement Board Store Actions              | EPIC-02 | KAN-003, KAN-004                   | M          | Backlog |
| 6     | KAN-006 | feature | Add Versioned Local Persistence            | EPIC-02 | KAN-005                            | M          | Backlog |
| 7     | KAN-007 | feature | Render Board From Store                    | EPIC-03 | KAN-005                            | M          | Backlog |
| 8     | KAN-008 | feature | Build Reusable Empty State Component Usage | EPIC-03 | KAN-007                            | S          | Backlog |
| 9     | KAN-009 | feature | Create Add Card Flow                       | EPIC-04 | KAN-005, KAN-007                   | M          | Backlog |
| 10    | KAN-010 | feature | Add Card Detail And Edit Flow              | EPIC-04 | KAN-009                            | M          | Backlog |
| 11    | KAN-011 | feature | Add Delete Card Flow                       | EPIC-04 | KAN-010                            | S          | Backlog |
| 12    | KAN-012 | feature | Move Card Between Columns With Controls    | EPIC-05 | KAN-005, KAN-010                   | M          | Backlog |
| 13    | KAN-013 | feature | Reorder Cards With Controls                | EPIC-05 | KAN-012                            | S          | Backlog |
| 14    | KAN-014 | feature | Add Text Search                            | EPIC-06 | KAN-007                            | S          | Backlog |
| 15    | KAN-015 | feature | Add Basic Card Filters                     | EPIC-06 | KAN-010, KAN-014                   | M          | Backlog |
| 16    | KAN-016 | feature | Implement Settings Store                   | EPIC-07 | KAN-006                            | S          | Backlog |
| 17    | KAN-017 | feature | Build Settings Page Controls               | EPIC-07 | KAN-016                            | S          | Backlog |
| 18    | KAN-018 | feature | Add Responsive Board Polish                | EPIC-08 | KAN-007, KAN-009, KAN-012          | M          | Backlog |
| 19    | KAN-019 | test    | Accessibility Pass For Core Flows          | EPIC-08 | KAN-009-KAN-018                    | M          | Backlog |
| 20    | KAN-020 | chore   | Add Test Tooling                           | EPIC-08 | KAN-001                            | S          | Backlog |
| 21    | KAN-021 | test    | Add Store And Utility Tests                | EPIC-08 | KAN-020, KAN-005, KAN-006, KAN-015 | M          | Backlog |
| 22    | KAN-022 | test    | Add Core Flow Integration Tests            | EPIC-08 | KAN-020, KAN-009-KAN-017           | L          | Backlog |
| 23    | KAN-023 | chore   | Production Readiness Review                | EPIC-08 | All MVP tickets                    | S          | Backlog |
| 24    | KAN-024 | spike   | Spike Drag And Drop Approach               | EPIC-09 | KAN-013                            | S          | Backlog |
| 25    | KAN-025 | feature | Add Drag And Drop Card Movement            | EPIC-09 | KAN-024                            | L          | Backlog |
| 26    | KAN-026 | feature | Add Import And Export                      | EPIC-09 | KAN-006, KAN-023                   | M          | Backlog |
| 27    | KAN-027 | spike   | Add Attachments Spike                      | EPIC-09 | KAN-023                            | S          | Backlog |
