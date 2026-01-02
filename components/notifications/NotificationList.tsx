/**
 * NotificationList Component
 * 
 * Displays a list of low-stock notifications with filtering by status.
 */

'use client';

import { LowStockNotification, LowStockNotificationStatus } from '@/types/entities';
import NotificationItem from './NotificationItem';
import { Text } from '@/components/common';

interface NotificationListProps {
  notifications: LowStockNotification[];
  onAcknowledge: (notificationId: string) => void;
  onResolve: (notificationId: string) => void;
  onAddToShoppingList: (notification: LowStockNotification) => void;
  isAdmin: boolean;
  statusFilter?: LowStockNotificationStatus | 'all';
}

/**
 * Filter notifications by status
 */
const filterNotifications = (
  notifications: LowStockNotification[],
  statusFilter?: LowStockNotificationStatus | 'all'
): LowStockNotification[] => {
  if (!statusFilter || statusFilter === 'all') {
    return notifications;
  }
  return notifications.filter((n) => n.status === statusFilter);
};

/**
 * Sort notifications by createdAt (newest first)
 */
const sortNotifications = (
  notifications: LowStockNotification[]
): LowStockNotification[] => {
  return [...notifications].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export default function NotificationList({
  notifications,
  onAcknowledge,
  onResolve,
  onAddToShoppingList,
  isAdmin,
  statusFilter,
}: NotificationListProps) {
  const filteredNotifications = filterNotifications(notifications, statusFilter);
  const sortedNotifications = sortNotifications(filteredNotifications);

  if (sortedNotifications.length === 0) {
    return (
      <div className="text-center py-12" data-testid="empty-state">
        <svg
          className="mx-auto h-12 w-12 text-text-secondary"
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
        <h3 className="mt-2 text-sm font-medium text-text-secondary">No notifications</h3>
        <Text variant="bodySmall" color="secondary" className="mt-1">
          {statusFilter && statusFilter !== 'all'
            ? `No ${statusFilter} notifications found.`
            : 'All inventory items are above their thresholds.'}
        </Text>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-surface shadow sm:rounded-md" data-testid="notification-list">
      <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
        {sortedNotifications.map((notification) => (
          <NotificationItem
            key={notification.notificationId}
            notification={notification}
            onAcknowledge={onAcknowledge}
            onResolve={onResolve}
            onAddToShoppingList={onAddToShoppingList}
            isAdmin={isAdmin}
          />
        ))}
      </ul>
    </div>
  );
}