import { createClient } from '@supabase/supabase-js';
import { env } from '../../config/env';

export const supabase = createClient(env.supabaseUrl, env.supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
