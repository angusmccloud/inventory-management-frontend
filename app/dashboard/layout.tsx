/**
 * Dashboard Layout - Family Inventory Management System
 * 
 * Protected layout for authenticated users with navigation.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUserContext, handleLogout } from '@/lib/auth';
import { UserContext } from '@/types/entities';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Load user context
    const context = getUserContext();
    setUserContext(context);
    setLoading(false);
  }, [router]);

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
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-xl font-bold text-blue-600">
                  Family Inventory
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a
                  href="/dashboard"
                  className="inline-flex items-center border-b-2 border-blue-500 px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  Dashboard
                </a>
                <a
                  href="/dashboard/inventory"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Inventory
                </a>
              </div>
            </div>
            <div className="flex items-center">
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
        </div>
      </nav>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
