import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase/client';

type RequestOtpInput = {
  email: string;
  emailRedirectTo?: string;
};

type VerifyOtpInput = {
  email: string;
  token: string;
};

export async function requestEmailOtp({
  email,
  emailRedirectTo,
}: RequestOtpInput) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo,
      shouldCreateUser: true,
    },
  });

  if (error) {
    throw error;
  }
}

export async function verifyEmailOtp({ email, token }: VerifyOtpInput) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}

export async function signOutCurrentSession() {
  const { error } = await supabase.auth.signOut({ scope: 'local' });

  if (error) {
    throw error;
  }
}
