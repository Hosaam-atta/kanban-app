# Supabase Foundation

## Purpose

This document captures the first backend foundation decisions for the Kanban platform.

The frontend uses Supabase for:

- Authentication.
- PostgreSQL database access.
- Row Level Security.
- Storage.
- Realtime.
- Edge Functions or database functions when a flow needs server-side authority.

## Project Connection

Frontend environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_ANON_KEY` as a legacy fallback if needed

The frontend must never include:

- Supabase service-role key.
- Database password.
- Personal access token.
- SMTP secrets.
- Any private backend secret.

## Client Location

The browser Supabase client lives in:

`src/lib/supabase/client.ts`

Application code should not create extra Supabase clients inside pages or components.

Preferred call path:

```text
Component
-> Feature Hook
-> Service
-> Supabase Client
-> Supabase
```

## Current Phase Output

- Supabase client package installed.
- Environment variable example added.
- Browser client initialized from Vite environment variables.
- Migration directory created.
- Initial backend planning docs added.

## Current Limitation

The connected Supabase MCP server is configured as read-only. Direct database changes, migrations, RLS edits, storage bucket creation, or Edge Function deployment should not be expected until write access or a local Supabase CLI workflow is intentionally enabled.
