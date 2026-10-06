const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY;
const authBypassEnabled =
  import.meta.env.DEV && import.meta.env.VITE_AUTH_BYPASS_ENABLED === 'true';

function requireEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing ${name} environment variable.`);
  }

  return value;
}

export const env = {
  authBypassEnabled,
  supabaseUrl: requireEnv(supabaseUrl, 'VITE_SUPABASE_URL'),
  supabaseKey: requireEnv(
    supabaseKey,
    'VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY',
  ),
} as const;
