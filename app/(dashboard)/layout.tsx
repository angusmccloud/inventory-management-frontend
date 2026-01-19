/**
 * Dashboard Layout - Inventory HQ
 *
 * Protected layout for authenticated users with navigation.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  isAuthenticated,
  getUserContext,
  handleLogout,
  setUserContext as saveUserContext,
} from '@/lib/auth';
import { listNotifications } from '@/lib/api/notifications';
import { listInventoryItems } from '@/lib/api/inventory';
import { listUserFamilies } from '@/lib/api/families';
import { listSuggestions } from '@/lib/api/suggestions';
import { getNavigationItems, isNavItemActive } from '@/lib/navigation';
import { UserContext } from '@/types/entities';
import { PageLoading } from '@/components/common';
import { Button } from '@/components/common/Button/Button';
import { Badge } from '@/components/common/Badge/Badge';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeNotificationCount, setActiveNotificationCount] = useState<number>(0);
  const [activeSuggestionCount, setActiveSuggestionCount] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Get navigation items filtered by user role
  const isAdmin = userContext?.role === 'admin';
  const navItems = getNavigationItems(isAdmin);

  // Fetch active notification count by comparing notifications to active inventory items
  const fetchNotificationCount = useCallback(async (familyId: string) => {
    try {
      // Fetch notifications and active inventory items in parallel
      const [notificationsData, inventoryData] = await Promise.all([
        listNotifications(familyId),
        listInventoryItems(familyId),
      ]);

      const activeItemIds = new Set((inventoryData.items || []).map((i) => i.itemId));

      // Count only notifications for active items with status 'active'
      const activeCount = (notificationsData || []).filter(
        (n) => activeItemIds.has(n.itemId) && n.status === 'active'
      ).length;

      setActiveNotificationCount(activeCount);
    } catch (error) {
      // Silently fail - notification count is not critical
      console.error('Failed to fetch notification count:', error);
      setActiveNotificationCount(0);
    }
  }, []);

  // Fetch active suggestion count by comparing suggestions to active inventory items
  const fetchSuggestionCount = useCallback(async (familyId: string) => {
    try {
      // Fetch pending suggestions and active inventory items in parallel
      const [suggestionsData, inventoryData] = await Promise.all([
        listSuggestions(familyId, { status: 'pending' }),
        listInventoryItems(familyId),
      ]);

      const activeItemIds = new Set((inventoryData.items || []).map((i) => i.itemId));

      const activeCount = (suggestionsData.suggestions || []).filter((s) => {
        if (s.itemId) {
          return activeItemIds.has(s.itemId);
        }
        return true;
      }).length;

      setActiveSuggestionCount(activeCount);
    } catch (error) {
      // Silently fail - suggestion count is not critical
      console.error('Failed to fetch suggestion count:', error);
      setActiveSuggestionCount(0);
    }
  }, []);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Load user context
    const context = getUserContext();
    setUserContext(context);

    // Fetch the actual role from family membership (not from cached JWT)
    const loadUserRole = async () => {
      try {
        const families = await listUserFamilies();
        if (families && families.length > 0 && families[0] && context) {
          const family = families[0];
          // Update the context with the actual role from family membership
          const updatedContext = {
            ...context,
            familyId: family.familyId,
            role: family.role as 'admin' | 'suggester',
          };
          saveUserContext(updatedContext);
          setUserContext(updatedContext);

          // Fetch notification count with the updated family ID
          if (updatedContext.familyId) {
            fetchNotificationCount(updatedContext.familyId);
            fetchSuggestionCount(updatedContext.familyId);
          }
        }
      } catch (error) {
        console.error('Failed to load user role:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserRole();
  }, [router, fetchNotificationCount, fetchSuggestionCount]);

  if (loading) {
    return <PageLoading message="Loading..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-surface shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <div className="flex flex-shrink-0 items-center">
              <h1 className="text-xl font-bold text-secondary">Inventory HQ</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:space-x-2 lg:space-x-4">
              {navItems.map((item) => {
                const isActive = isNavItemActive(item, pathname);
                const badgeCount =
                  item.badge === 'notifications'
                    ? activeNotificationCount
                    : item.badge === 'suggestions'
                      ? activeSuggestionCount
                      : 0;
                const showBadge = badgeCount > 0;
                const badgeTestId =
                  item.badge === 'notifications'
                    ? 'notification-badge'
                    : item.badge === 'suggestions'
                      ? 'suggestion-badge'
                      : undefined;

                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`inline-flex items-center whitespace-nowrap border-b-2 px-2 pt-1 text-sm font-medium lg:px-3 ${
                      isActive
                        ? 'border-primary text-text-default'
                        : 'border-transparent text-text-secondary hover:border-border hover:text-text-default'
                    }`}
                  >
                    <span>{item.label}</span>
                    {showBadge && (
                      <span
                        className="ml-2 inline-flex min-w-[20px] items-center justify-center rounded-full bg-warning px-1.5 py-0.5 text-xs font-bold text-warning-contrast"
                        data-testid={badgeTestId}
                      >
                        {badgeCount > 9 ? '9+' : badgeCount}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>

            {/* Right side container */}
            <div className="flex items-center space-x-3">
              {/* Desktop User Info */}
              <div className="hidden md:flex md:items-center md:space-x-3">
                <div className="hidden lg:flex lg:flex-col lg:items-end">
                  <span className="max-w-[150px] truncate text-sm text-text-secondary">
                    {userContext?.name || userContext?.email}
                  </span>
                  {userContext?.familyId && (
                    <Badge variant="info" size="sm">
                      {userContext?.role}
                    </Badge>
                  )}
                </div>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center rounded-md p-2 text-text-secondary hover:bg-surface-elevated hover:text-text-default focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {!mobileMenuOpen ? (
                    <svg
                      className="block h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="pb-3 md:hidden">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = isNavItemActive(item, pathname);
                  const badgeCount =
                    item.badge === 'notifications'
                      ? activeNotificationCount
                      : item.badge === 'suggestions'
                        ? activeSuggestionCount
                        : 0;
                  const showBadge = badgeCount > 0;

                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      className={`${showBadge ? 'flex items-center' : 'block'} border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                        isActive
                          ? 'border-primary bg-primary/10 text-text-default'
                          : 'border-transparent text-text-secondary hover:border-border hover:bg-surface-elevated hover:text-text-default'
                      }`}
                    >
                      <span>{item.label}</span>
                      {showBadge && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-error px-2 py-0.5 text-xs font-bold text-error-contrast">
                          {badgeCount > 9 ? '9+' : badgeCount}
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
              <div className="mt-3 border-t border-border pt-4">
                <div className="mb-3 px-4">
                  <div className="mb-1 text-sm font-medium text-text-secondary">
                    {userContext?.name || userContext?.email}
                  </div>
                  {userContext?.familyId && (
                    <Badge variant="info" size="sm">
                      {userContext?.role}
                    </Badge>
                  )}
                </div>
                <div className="px-2">
                  <Button variant="secondary" size="sm" fullWidth onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
