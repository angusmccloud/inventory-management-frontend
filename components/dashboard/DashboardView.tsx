'use client';

import { useEffect, useState, useCallback } from 'react';
import { getDashboardPublic, recordDashboardAccess } from '@/lib/api/dashboards';
import { DashboardWithItems, DashboardItem as DashboardItemType } from '@/types/dashboard';
import DashboardItemCard from './DashboardItemCard';
import { Text } from '@/components/common/Text/Text';

interface DashboardViewProps {
  dashboardId: string;
}

export default function DashboardView({ dashboardId }: DashboardViewProps) {
  const [dashboard, setDashboard] = useState<DashboardWithItems | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(
    async (isRefresh: boolean = false): Promise<void> => {
      try {
        if (!isRefresh) {
          setLoading(true);
        }
        setError(null);

        // Fetch dashboard data
        const data = await getDashboardPublic(dashboardId);
        setDashboard(data);

        // Record access on initial load only (not on refresh)
        if (!isRefresh) {
          recordDashboardAccess(dashboardId).catch((err: Error) => {
            console.warn('Failed to record dashboard access:', err);
          });
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    },
    [dashboardId]
  );

  // Initial load
  useEffect(() => {
    loadDashboard(false);
  }, [loadDashboard]);

  // Refresh on window focus (T038)
  useEffect(() => {
    const handleFocus = (): void => {
      // Only refresh if dashboard is already loaded
      if (dashboard) {
        loadDashboard(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [dashboard, loadDashboard]);

  // Handle local quantity updates from cards
  const handleQuantityChange = useCallback((itemId: string, newQuantity: number): void => {
    setDashboard((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        items: prev.items.map((item) =>
          item.itemId === itemId ? { ...item, quantity: newQuantity } : item
        ),
      };
    });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600 dark:border-blue-400"></div>
          <Text variant="body" color="secondary" className="mt-4">
            Loading dashboard...
          </Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <svg
              className="mx-auto mb-4 h-12 w-12 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="mb-2 text-xl font-semibold text-red-900 dark:text-red-100">
              Dashboard Not Found
            </h2>
            <Text variant="body" color="error">
              {error}
            </Text>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Text variant="body" color="secondary">
            No dashboard data available
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Dashboard Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {dashboard.dashboard.title}
          </h1>
        </div>

        {/* Dashboard Items Grid */}
        {dashboard.items.length === 0 ? (
          <div className="py-12 text-center">
            <Text variant="body" color="secondary">
              No items in this dashboard
            </Text>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dashboard.items.map((item: DashboardItemType) => (
              <DashboardItemCard
                key={item.itemId}
                item={item}
                dashboardId={dashboardId}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
