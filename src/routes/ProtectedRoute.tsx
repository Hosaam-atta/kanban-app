import type { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { env } from '../config/env';

type ProtectedRouteProps = {
  children: ReactElement;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <main className="centered-page">Loading session...</main>;
  }

  if (!isAuthenticated && !env.authBypassEnabled) {
    return <Navigate replace state={{ from: location }} to="/auth" />;
  }

  return children;
}
