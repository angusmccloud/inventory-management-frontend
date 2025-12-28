/**
 * Navigation Configuration
 * 
 * Single source of truth for dashboard navigation menu items and their access control.
 */

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  requiresAdmin?: boolean;
  badge?: 'notifications';
  matchPaths?: string[]; // Additional paths that should show this item as active
}

/**
 * Dashboard navigation items in display order.
 * Role-based access is controlled via requiresAdmin flag.
 */
export const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    href: '/dashboard/inventory',
  },
  {
    id: 'shopping',
    label: 'Shopping',
    href: '/dashboard/shopping-list',
  },
  {
    id: 'suggestions',
    label: 'Suggestions',
    href: '/dashboard/suggestions',
    matchPaths: ['/dashboard/suggestions/suggest'],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/dashboard/notifications',
    requiresAdmin: true,
    badge: 'notifications',
    icon: 'bell',
  },
  {
    id: 'members',
    label: 'Members',
    href: '/dashboard/members',
    requiresAdmin: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/dashboard/settings/reference-data',
    requiresAdmin: true,
    matchPaths: ['/dashboard/settings/categories', '/dashboard/settings/units', '/dashboard/settings/stores'],
  },
];

/**
 * Get navigation items filtered by user role.
 */
export function getNavigationItems(isAdmin: boolean): NavItem[] {
  return navigationItems.filter(item => !item.requiresAdmin || isAdmin);
}

/**
 * Check if a navigation item should be highlighted as active.
 */
export function isNavItemActive(item: NavItem, currentPath: string): boolean {
  // Exact match
  if (currentPath === item.href) {
    return true;
  }
  
  // Check additional match paths
  if (item.matchPaths) {
    return item.matchPaths.some(path => currentPath.startsWith(path));
  }
  
  return false;
}
