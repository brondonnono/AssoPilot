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
    icon: 'dashboard',
    path: '/dashboard',
    isActive: false,
    canSee: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    title: 'sidebar.nav-users-title',
    icon: 'supervised_user_circle',
    path: '/users',
    isActive: false,
    canSee: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    title: 'sidebar.nav-members-title',
    icon: 'supervisor_account',
    path: '/members',
    isActive: false,
    canSee: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    title: 'sidebar.nav-cotisations-title',
    icon: 'account_balance_wallet',
    path: '/cotisations',
    isActive: false,
    canSee: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    title: 'sidebar.nav-events-title',
    icon: 'event_note',
    path: '/events',
    isActive: false,
    canSee: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    title: 'sidebar.nav-user-logs-title',
    icon: 'history',
    path: '/logs',
    isActive: false,
    canSee: [UserRole.SUPER_ADMIN, UserRole.ROOT],
  },
  {
    title: 'sidebar.nav-migration-title',
    icon: 'dvr', //developer_mode
    path: '/manage-app',
    isActive: false,
    canSee: [UserRole.ROOT],
  },
];
