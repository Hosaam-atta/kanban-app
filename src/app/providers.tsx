import type { PropsWithChildren } from 'react';
import { AuthProvider } from '../features/auth/hooks/AuthProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}
