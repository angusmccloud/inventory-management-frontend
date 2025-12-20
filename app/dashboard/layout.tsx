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
import { UserContext } from '@/types/entities';

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
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex flex-1">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-xl font-bold text-blue-600">
                  Inventory HQ
                </h1>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a
                  href="/dashboard"
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                    pathname === '/dashboard'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </a>
                <a
                  href="/dashboard/inventory"
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                    pathname === '/dashboard/inventory'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Inventory
                </a>
                <a
                  href="/dashboard/shopping-list"
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                    pathname === '/dashboard/shopping-list'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Shopping List
                </a>
                <a
                  href="/dashboard/notifications"
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                    pathname === '/dashboard/notifications'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <span className="relative">
                    {/* Bell icon */}
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
                    {/* Notification badge */}
                    {activeNotificationCount > 0 && (
                      <span
                        className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                        data-testid="notification-badge"
                      >
                        {activeNotificationCount > 9 ? '9+' : activeNotificationCount}
                      </span>
                    )}
                  </span>
                  <span className="ml-1">Notifications</span>
                </a>
                <a
                  href="/dashboard/members"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Members
                </a>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden ml-auto">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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

            {/* Desktop User Menu */}
            <div className="hidden sm:flex sm:items-center">
              <div className="flex-shrink-0">
                <span className="text-sm text-gray-700">
                  {userContext?.name || userContext?.email}
                </span>
                <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {userContext?.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden pb-3">
              <div className="space-y-1">
                <a
                  href="/dashboard"
                  className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                    pathname === '/dashboard'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  Dashboard
                </a>
                <a
                  href="/dashboard/inventory"
                  className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                    pathname === '/dashboard/inventory'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  Inventory
                </a>
                <a
                  href="/dashboard/shopping-list"
                  className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                    pathname === '/dashboard/shopping-list'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  Shopping List
                </a>
                <a
                  href="/dashboard/notifications"
                  className={`flex items-center border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                    pathname === '/dashboard/notifications'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <span>Notifications</span>
                  {activeNotificationCount > 0 && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                      {activeNotificationCount > 9 ? '9+' : activeNotificationCount}
                    </span>
                  )}
                </a>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-3">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <span className="text-base font-medium text-gray-800">
                      {userContext?.name || userContext?.email}
                    </span>
                    <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {userContext?.role}
                    </span>
                  </div>
                </div>
                <div className="mt-3 px-2">
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-md bg-white px-3 py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
