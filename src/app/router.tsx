import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { PublicRoute } from '../routes/PublicRoute';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { LoginPage } from '../pages/auth/LoginPage';
import { VerifyOtpPage } from '../pages/auth/VerifyOtpPage';
import { BoardPage } from '../pages/board/BoardPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { MembersPage } from '../pages/team/MembersPage';
import { InvitationsPage } from '../pages/team/InvitationsPage';
import { ActivityPage } from '../pages/team/ActivityPage';
import { AccessDeniedPage } from '../pages/AccessDeniedPage';
import { WorkspacePage } from '../pages/workspaces/WorkspacePage';
import { CreateWorkspacePage } from '../pages/workspaces/CreateWorkspacePage';

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/auth/verify',
    element: (
      <PublicRoute>
        <VerifyOtpPage />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Navigate replace to="/workspaces" />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <AppLayout>
          <SettingsPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/workspaces',
    element: (
      <ProtectedRoute>
        <AppLayout>
          <WorkspacePage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/workspaces/:workspaceId/boards/:boardId',
    element: (
      <ProtectedRoute>
        <AppLayout>
          <BoardPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/workspaces/new',
    element: (
      <ProtectedRoute>
        <AppLayout>
          <CreateWorkspacePage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/team/members',
    element: (
      <ProtectedRoute>
        <AppLayout>
          <MembersPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/team/invitations',
    element: (
      <ProtectedRoute>
        <AppLayout>
          <InvitationsPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/team/activity',
    element: (
      <ProtectedRoute>
        <AppLayout>
          <ActivityPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/access-denied',
    element: (
      <ProtectedRoute>
        <AppLayout>
          <AccessDeniedPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
