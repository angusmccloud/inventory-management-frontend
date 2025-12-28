/**
 * Dashboard Layout - Inventory HQ
 *
 * Protected layout for authenticated users with navigation.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, getUserContext, handleLogout, setUserContext as saveUserContext } from '@/lib/auth';
import { getActiveNotificationCount } from '@/lib/api/notifications';
import { listUserFamilies } from '@/lib/api/families';
import { getNavigationItems, isNavItemActive } from '@/lib/navigation';
import { UserContext } from '@/types/entities';
import { LoadingSpinner } from '@/components/common';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeNotificationCount, setActiveNotificationCount] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Get navigation items filtered by user role
  const isAdmin = userContext?.role === 'admin';
  const navItems = getNavigationItems(isAdmin);

  // Fetch active notification count
  const fetchNotificationCount = useCallback(async (familyId: string) => {
    try {
      const count = await getActiveNotificationCount(familyId);
      setActiveNotificationCount(count);
    } catch {
      // Silently fail - notification count is not critical
      setActiveNotificationCount(0);
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
          }
        }
      } catch (error) {
        console.error('Failed to load user role:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserRole();
  }, [router, fetchNotificationCount]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <div className="flex flex-shrink-0 items-center">
              <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Inventory HQ
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex md:space-x-2 lg:space-x-4">
              {navItems.map((item) => {
                const isActive = isNavItemActive(item, pathname);
                const showBadge = item.badge === 'notifications' && activeNotificationCount > 0;
                
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`inline-flex items-center border-b-2 px-2 lg:px-3 pt-1 text-sm font-medium whitespace-nowrap ${
                      isActive
                        ? 'border-blue-500 text-gray-900 dark:text-gray-100'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {item.icon === 'bell' && (
                      <span className="relative">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                        {showBadge && (
                          <span
                            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                            data-testid="notification-badge"
                          >
                            {activeNotificationCount > 9 ? '9+' : activeNotificationCount}
                          </span>
                        )}
                      </span>
                    )}
                    <span className={item.icon === 'bell' ? 'ml-1 hidden lg:inline' : ''}>
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </div>
            
            {/* Right side container */}
            <div className="flex items-center space-x-3">
              {/* Desktop User Info */}
              <div className="hidden md:flex md:items-center md:space-x-3">
                <div className="hidden lg:flex lg:flex-col lg:items-end">
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                    {userContext?.name || userContext?.email}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-2 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200">
                    {userContext?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-white dark:bg-gray-700 px-3 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Logout
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-3">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = isNavItemActive(item, pathname);
                  const showBadge = item.badge === 'notifications' && activeNotificationCount > 0;
                  
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      className={`${showBadge ? 'flex items-center' : 'block'} border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200'
                      }`}
                    >
                      <span>{item.label}</span>
                      {showBadge && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                          {activeNotificationCount > 9 ? '9+' : activeNotificationCount}
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-3">
                <div className="px-4 mb-3">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                    {userContext?.name || userContext?.email}
                  </div>
                  <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200">
                    {userContext?.role}
                  </span>
                </div>
                <div className="px-2">
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-base font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
