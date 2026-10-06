import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { env } from '../config/env';

type PublicRouteProps = {
  children: ReactElement;
};

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <main className="centered-page">Loading session...</main>;
  }

  if (isAuthenticated || env.authBypassEnabled) {
    return <Navigate replace to="/" />;
  }

  return children;
}
