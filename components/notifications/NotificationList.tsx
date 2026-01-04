/**
 * NotificationList Component
 * 
 * Displays a list of low-stock notifications with filtering by status.
 */

'use client';

import { LowStockNotification } from '@/types/entities';
import NotificationItem from './NotificationItem';
import { Text } from '@/components/common';

interface NotificationListProps {
  notifications: LowStockNotification[];
  onAddToShoppingList: (notification: LowStockNotification) => void;
  onEdit: (notification: LowStockNotification) => void;
  isAdmin: boolean;
  processingId?: string | null;
}

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
  onAddToShoppingList,
  onEdit,
  isAdmin,
  processingId,
}: NotificationListProps) {
  const sortedNotifications = sortNotifications(notifications);

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
          All inventory items are above their thresholds.
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
            onAddToShoppingList={onAddToShoppingList}
            onEdit={onEdit}
            isAdmin={isAdmin}
            processingId={processingId}
          />
        ))}
      </ul>
    </div>
  );
}