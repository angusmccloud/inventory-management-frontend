/**
 * NotificationItem Component
 * 
 * Displays an individual low-stock notification with status badge,
 * quantity information, and acknowledge action for admins.
 */

'use client';

import { LowStockNotification, LowStockNotificationStatus } from '@/types/entities';

interface NotificationItemProps {
  notification: LowStockNotification;
  onAcknowledge: (notificationId: string) => void;
  onResolve: (notificationId: string) => void;
  onAddToShoppingList: (notification: LowStockNotification) => void;
  isAdmin: boolean;
}

/**
 * Get status badge styling based on notification status
 */
const getStatusBadgeStyles = (status: LowStockNotificationStatus): string => {
  switch (status) {
    case 'active':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
    case 'acknowledged':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
    case 'resolved':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  }
};

/**
 * Format date for display
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get status display text
 */
const getStatusDisplayText = (status: LowStockNotificationStatus): string => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'acknowledged':
      return 'Acknowledged';
    case 'resolved':
      return 'Resolved';
    default:
      return status;
  }
};

export default function NotificationItem({
  notification,
  onAcknowledge,
  onResolve,
  onAddToShoppingList,
  isAdmin,
}: NotificationItemProps) {
  const statusBadgeStyles = getStatusBadgeStyles(notification.status);
  const canAcknowledge = isAdmin && notification.status === 'active';
  const canResolve = isAdmin && (notification.status === 'active' || notification.status === 'acknowledged');

  return (
    <li className="px-4 py-4 sm:px-6" data-testid="notification-item">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* Low stock icon */}
            <svg
              className="h-5 w-5 text-red-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
              {notification.itemName}
            </h3>
            
            {/* Status badge */}
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeStyles}`}
              data-testid="status-badge"
            >
              {getStatusDisplayText(notification.status)}
            </span>
          </div>
          
          <div className="mt-2 flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
            {/* Quantity info */}
            <div data-testid="quantity-info">
              <span className="font-semibold text-gray-900 dark:text-gray-100">Current:</span>{' '}
              <span className="text-red-600 dark:text-red-400 font-medium">{notification.currentQuantity}</span>
              {' / '}
              <span className="font-semibold text-gray-900 dark:text-gray-100">Threshold:</span>{' '}
              {notification.threshold}
            </div>
            
            {/* Timestamp */}
            <div data-testid="timestamp">
              <span className="font-semibold text-gray-900 dark:text-gray-100">Created:</span>{' '}
              {formatDate(notification.createdAt)}
            </div>
            
            {/* Resolved timestamp if applicable */}
            {notification.resolvedAt && (
              <div data-testid="resolved-timestamp">
                <span className="font-semibold text-gray-900 dark:text-gray-100">Resolved:</span>{' '}
                {formatDate(notification.resolvedAt)}
              </div>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="ml-4 flex-shrink-0 flex gap-2">
          {/* Add to Shopping List button - show for active and acknowledged notifications */}
          {(notification.status === 'active' || notification.status === 'acknowledged') && (
            <button
              onClick={() => onAddToShoppingList(notification)}
              className="rounded-md bg-purple-50 dark:bg-purple-900/30 px-3 py-2 text-sm font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              data-testid="add-to-shopping-list-button"
              title="Add to Shopping List"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
          )}
          
          {/* Acknowledge button - only for admins on active notifications */}
          {canAcknowledge && (
            <button
              onClick={() => onAcknowledge(notification.notificationId)}
              className="rounded-md bg-yellow-50 dark:bg-yellow-900/30 px-3 py-2 text-sm font-semibold text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              data-testid="acknowledge-button"
            >
              Acknowledge
            </button>
          )}
          
          {/* Resolve button - only for admins on active or acknowledged notifications */}
          {canResolve && (
            <button
              onClick={() => onResolve(notification.notificationId)}
              className="rounded-md bg-green-50 dark:bg-green-900/30 px-3 py-2 text-sm font-semibold text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              data-testid="resolve-button"
            >
              Resolve
            </button>
          )}
        </div>
      </div>
    </li>
  );
}