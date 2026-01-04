/**
 * NotificationItem Component
 *
 * Displays an individual low-stock notification with status badge,
 * quantity information, and acknowledge action for admins.
 */

'use client';

import { LowStockNotification, LowStockNotificationStatus } from '@/types/entities';
import { Badge, Text, IconButton } from '@/components/common';
import type { BadgeVariant } from '@/components/common/Badge/Badge.types';
import { ShoppingCartIcon, PencilIcon } from '@/components/common/icons';

interface NotificationItemProps {
  notification: LowStockNotification;
  onAddToShoppingList: (notification: LowStockNotification) => void;
  onEdit?: (notification: LowStockNotification) => void;
  isAdmin: boolean;
  processingId?: string | null;
}

/**
 * Get status badge variant based on notification status
 */
const getStatusBadgeVariant = (status: LowStockNotificationStatus): BadgeVariant => {
  switch (status) {
    case 'active':
      return 'error';
    case 'acknowledged':
      return 'warning';
    case 'resolved':
      return 'success';
    default:
      return 'neutral';
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
  onAddToShoppingList,
  onEdit,
  isAdmin,
  processingId,
}: NotificationItemProps) {
  const statusVariant = getStatusBadgeVariant(notification.status);
  const isProcessing = processingId === notification.notificationId;
  // Reference isAdmin to avoid unused-variable TypeScript errors
  void isAdmin;

  return (
    <li className="px-4 py-4 sm:px-6" data-testid="notification-item">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {/* Low stock icon */}
            <svg
              className="h-5 w-5 flex-shrink-0 text-error"
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

            <Text as="h3" variant="body" weight="medium" className="truncate text-lg">
              {notification.itemName}
            </Text>

            {/* Status badge */}
            <Badge variant={statusVariant} data-testid="status-badge">
              {getStatusDisplayText(notification.status)}
            </Badge>
          </div>

          <div className="mt-2 flex flex-col text-sm text-text-default sm:flex-row sm:gap-4">
            {/* Quantity info */}
            <div data-testid="quantity-info">
              <span className="font-semibold text-text-default">Current:</span>{' '}
              <span className="font-medium text-error">{notification.currentQuantity}</span>
              {' / '}
              <span className="font-semibold text-text-default">Threshold:</span>{' '}
              {notification.threshold}
            </div>

            {/* Timestamp */}
            <div data-testid="timestamp">
              <span className="font-semibold text-text-default">Low Stock Alert:</span>{' '}
              {formatDate(notification.createdAt)}
            </div>

            {/* Resolved timestamp if applicable */}
            {notification.resolvedAt && (
              <div data-testid="resolved-timestamp">
                <span className="font-semibold text-text-default">Resolved:</span>{' '}
                {formatDate(notification.resolvedAt)}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="ml-4 flex flex-shrink-0 gap-2">
          {/* Reconcile button - show for active and acknowledged notifications */}
          {(notification.status === 'active' || notification.status === 'acknowledged') && (
            <IconButton
              icon={<PencilIcon className="h-5 w-5" />}
              aria-label="Reconcile item"
              variant="secondary"
              size="md"
              onClick={() => onEdit?.(notification)}
              data-testid="reconcile-button"
              disabled={isProcessing}
            />
          )}

          {/* Add to Shopping List button - show for active and acknowledged notifications */}
          {(notification.status === 'active' || notification.status === 'acknowledged') && (
            <IconButton
              icon={<ShoppingCartIcon className="h-5 w-5" />}
              aria-label="Add to Shopping List"
              variant="secondary"
              size="md"
              onClick={() => onAddToShoppingList(notification)}
              data-testid="add-to-shopping-list-button"
              disabled={isProcessing}
            />
          )}

          {/* Acknowledge/Resolve actions removed from this view; admin actions are handled elsewhere */}
        </div>
      </div>
    </li>
  );
}
