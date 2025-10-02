import { UserRole } from '../enums/UserRole.enum';

export interface NavItem {
  title: string;
  icon: string;
  path: string;
  canSee: UserRole[];
  isActive: boolean;
}

export const navItems: NavItem[] = [
  {
    title: 'sidebar.nav-dashboard-title',
    icon: 'ri-home-9-line',
    path: '/dashboard',
    isActive: false,
    canSee: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    title: 'sidebar.nav-users-title',
    icon: 'ri-group-2-line',
    path: '/users',
    isActive: false,
    canSee: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    title: 'sidebar.nav-members-title',
    icon: 'ri-team-line',
    path: '/members',
    isActive: false,
    canSee: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    title: 'sidebar.nav-cotisations-title',
    icon: 'ri-wallet-3-line',
    path: '/cotisations',
    isActive: false,
    canSee: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    title: 'sidebar.nav-events-title',
    icon: 'ri-calendar-event-line',
    path: '/events',
    isActive: false,
    canSee: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    title: 'sidebar.nav-user-logs-title',
    icon: 'ri-history-line',
    path: '/logs',
    isActive: false,
    canSee: [UserRole.SUPER_ADMIN, UserRole.ROOT],
  },
  {
    title: 'sidebar.nav-migration-title',
    icon: 'ri-database-2-line',
    path: '/migration',
    isActive: false,
    canSee: [UserRole.ROOT],
  },
];
