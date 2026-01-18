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
    href: '/inventory',
  },
  {
    id: 'shopping',
    label: 'Shopping',
    href: '/shopping-list',
  },
  {
    id: 'suggestions',
    label: 'Suggestions',
    href: '/suggestions',
    matchPaths: ['/suggestions/suggest'],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/notifications',
    requiresAdmin: true,
    badge: 'notifications',
    // icon: 'bell',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
  },
  {
    id: 'help',
    label: 'Help',
    href: '/help',
    matchPaths: ['/help'],
  },
];

/**
 * Get navigation items filtered by user role.
 */
export function getNavigationItems(isAdmin: boolean): NavItem[] {
  return navigationItems.filter((item) => !item.requiresAdmin || isAdmin);
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
    return item.matchPaths.some((path) => currentPath.startsWith(path));
  }

  return false;
}
