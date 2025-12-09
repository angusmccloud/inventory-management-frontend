/**
 * Notifications Page - Family Inventory Management System
 * 
 * Displays low-stock notifications with filtering and acknowledge functionality.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { getUserContext } from '@/lib/auth';
import { listNotifications, acknowledgeNotification } from '@/lib/api/notifications';
import { getErrorMessage } from '@/lib/api-client';
import { LowStockNotification, LowStockNotificationStatus, UserContext } from '@/types/entities';
import NotificationList from '@/components/notifications/NotificationList';

type StatusFilterOption = LowStockNotificationStatus | 'all';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<LowStockNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('all');
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [acknowledging, setAcknowledging] = useState<string | null>(null);

  // Load user context
  useEffect(() => {
    const context = getUserContext();
    setUserContext(context);
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!userContext?.familyId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch all notifications (we'll filter client-side for flexibility)
      const data = await listNotifications(userContext.familyId);
      setNotifications(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      // Set empty array on error so UI still renders
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [userContext?.familyId]);

  // Fetch notifications when user context is available
  useEffect(() => {
    if (userContext?.familyId) {
      fetchNotifications();
    }
  }, [userContext?.familyId, fetchNotifications]);

  // Handle acknowledge notification
  const handleAcknowledge = async (notificationId: string) => {
    if (!userContext?.familyId) {
      return;
    }

    setAcknowledging(notificationId);

    try {
      const updatedNotification = await acknowledgeNotification(
        userContext.familyId,
        notificationId
      );

      // Update the notification in the list
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? updatedNotification : n
        )
      );
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(`Failed to acknowledge notification: ${errorMessage}`);
    } finally {
      setAcknowledging(null);
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value as StatusFilterOption);
  };

  const isAdmin = userContext?.role === 'admin';

  // Count notifications by status
  const activeCount = notifications.filter((n) => n.status === 'active').length;
  const acknowledgedCount = notifications.filter((n) => n.status === 'acknowledged').length;
  const resolvedCount = notifications.filter((n) => n.status === 'resolved').length;

  return (
    <div>
      {/* Page header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-sm text-gray-700">
            Low-stock alerts for your inventory items.
          </p>
        </div>
        
        {/* Status filter */}
        <div className="mt-4 sm:mt-0">
          <label htmlFor="status-filter" className="sr-only">
            Filter by status
          </label>
          <select
            id="status-filter"
            name="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            data-testid="status-filter"
          >
            <option value="all">All Notifications ({notifications.length})</option>
            <option value="active">Active ({activeCount})</option>
            <option value="acknowledged">Acknowledged ({acknowledgedCount})</option>
            <option value="resolved">Resolved ({resolvedCount})</option>
          </select>
        </div>
      </div>

      {/* Status summary cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-red-50 px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-red-800">Active Alerts</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-red-900">
            {activeCount}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-yellow-50 px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-yellow-800">Acknowledged</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-yellow-900">
            {acknowledgedCount}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-green-50 px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-green-800">Resolved</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-900">
            {resolvedCount}
          </dd>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-6 rounded-md bg-red-50 p-4" data-testid="error-message">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={fetchNotifications}
                  className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="mt-6 flex justify-center py-12" data-testid="loading-state">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 animate-spin text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">Loading notifications...</p>
          </div>
        </div>
      )}

      {/* Notification list */}
      {!loading && (
        <div className="mt-6">
          <NotificationList
            notifications={notifications}
            onAcknowledge={handleAcknowledge}
            isAdmin={isAdmin}
            statusFilter={statusFilter}
          />
        </div>
      )}

      {/* Acknowledging indicator */}
      {acknowledging && (
        <div className="fixed bottom-4 right-4 rounded-md bg-blue-50 p-4 shadow-lg">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 animate-spin text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="ml-2 text-sm text-blue-700">Acknowledging...</span>
          </div>
        </div>
      )}
    </div>
  );
}