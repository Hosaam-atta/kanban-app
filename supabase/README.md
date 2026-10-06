# Supabase

This directory will contain database migrations and Supabase project files.

Current workflow:

1. Design schema and RLS policies in `docs/backend`.
2. Review security rules before writing migrations.
3. Add migrations in `supabase/migrations`.
4. Apply migrations only after review.

Do not commit service-role keys or database passwords.
