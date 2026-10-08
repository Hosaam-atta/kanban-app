# Known Issues And Follow-Up Fixes

This document tracks issues that are intentionally postponed so they can be reviewed and fixed before the final release.

## 1. Email OTP delivery

### Status

Postponed.

### Problem

Supabase Email OTP / magic link email delivery is not working reliably with the current email provider setup.

During testing, emails either did not arrive or were blocked by provider restrictions. One observed provider error mentioned that test emails could only be sent to a specific account unless a sending domain is verified.

### Current workaround

Local development is using a temporary auth bypass:

```env
VITE_AUTH_BYPASS_ENABLED=true
```

This is only for development and must not be enabled in production.

### Final fix direction

- Choose the final email provider.
- Verify the sending domain.
- Configure the provider in Supabase Auth.
- Confirm OTP or magic link email delivery to real user emails.
- Disable local auth bypass before production deployment.

## 2. Workspace management interaction

### Status

Postponed for UX refinement.

### Problem

The workspace row in the sidebar needs a cleaner management interaction.

We currently hide edit and delete actions by default and show them after double-clicking the workspace name. This works, but the interaction may not be discoverable enough for users and can feel less natural than a dedicated compact menu.

### Current behavior

- Single click opens or closes the workspace boards dropdown.
- Double click shows workspace edit and delete actions.
- A close action hides the management buttons again.

### Final fix direction

- Replace the double-click behavior with a clearer compact action menu.
- Consider a small `More` button that appears on hover or focus.
- Keep the default sidebar clean and compact.
- Make the interaction accessible by keyboard.
- Avoid showing edit/delete buttons permanently in the default state.

## 3. Task details final UX and permissions

### Status

Postponed for final UX and role review.

### Problem

Task details currently work locally, but the final experience still needs a full review before release.

The task now supports title, labels, due date, assignee, and a side note. The note is intentionally used instead of separate checklist or estimate fields. This keeps the task simpler, but the final layout and editing rules need to be reviewed once team roles are implemented.

### Current behavior

- Creating a task opens the task details modal immediately.
- Labels are entered as comma-separated values.
- Labels appear on the task card.
- The task note appears as a side note in the details modal.
- A short note preview appears on the task card when a note exists.
- Clicking the note preview opens the task details modal.
- `Priority`, `Status`, `Estimate`, and `Checklist` are intentionally not included.

### Final fix direction

- Review the task details layout after drag-and-drop and backend persistence are implemented.
- Replace free-text assignee with a real workspace member selector.
- Restrict label creation and editing to allowed roles, such as owner or team lead.
- Decide whether labels should be workspace-level presets instead of free text.
- Improve keyboard and mobile behavior for the task action menu and modal.
- Add validation rules for empty labels, duplicate labels, and very long labels.
