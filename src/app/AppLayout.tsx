import { ChevronDown, Menu, Settings, Users, X } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { WorkspaceSidebar } from '../features/workspaces/components/WorkspaceSidebar';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useUiStore } from '../store/ui.store';
import { env } from '../config/env';

const navigationItems = [
  {
    label: 'Settings',
    to: '/settings',
    icon: Settings,
  },
];

const teamItems = [
  {
    label: 'Members',
    to: '/team/members',
  },
  {
    label: 'Invitations',
    to: '/team/invitations',
  },
  {
    label: 'Activity',
    to: '/team/activity',
  },
];

export function AppLayout({ children }: PropsWithChildren) {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const [teamMenuOpen, setTeamMenuOpen] = useState(true);
  const teamMenuActive = location.pathname.startsWith('/team');

  return (
    <div className="layout-shell">
      <aside className={sidebarOpen ? 'sidebar sidebar-open' : 'sidebar'}>
        <div className="sidebar-header">
          <Link className="brand" to="/">
            KanbanFlow
          </Link>
          <button
            aria-label="Close sidebar"
            className="icon-button sidebar-close"
            onClick={toggleSidebar}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <WorkspaceSidebar />

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigationItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? 'sidebar-link sidebar-link-active' : 'sidebar-link'
              }
              key={item.to}
              to={item.to}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="sidebar-group">
            <button
              aria-controls="team-navigation"
              aria-expanded={teamMenuOpen}
              className={
                teamMenuActive
                  ? 'sidebar-link sidebar-link-active'
                  : 'sidebar-link'
              }
              onClick={() => setTeamMenuOpen((isOpen) => !isOpen)}
              type="button"
            >
              <Users size={18} />
              <span>Team</span>
              <ChevronDown
                className={
                  teamMenuOpen
                    ? 'sidebar-chevron sidebar-chevron-open'
                    : 'sidebar-chevron'
                }
                size={16}
              />
            </button>

            {teamMenuOpen ? (
              <nav
                className="sidebar-subnav"
                id="team-navigation"
                aria-label="Team navigation"
              >
                {teamItems.map((item) => (
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? 'sidebar-sublink sidebar-sublink-active'
                        : 'sidebar-sublink'
                    }
                    key={item.to}
                    to={item.to}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            ) : null}
          </div>
        </nav>
      </aside>

      <div className="layout-main">
        <header className="app-topbar">
          <button
            aria-label="Toggle sidebar"
            className="icon-button"
            onClick={toggleSidebar}
            type="button"
          >
            <Menu size={20} />
          </button>
          <div className="topbar-account">
            <span>
              {user?.email ??
                (env.authBypassEnabled ? 'Local workspace' : 'Signed in')}
            </span>
            <button
              className="button button-secondary"
              onClick={signOut}
              type="button"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="layout-content">{children}</div>
      </div>
    </div>
  );
}
