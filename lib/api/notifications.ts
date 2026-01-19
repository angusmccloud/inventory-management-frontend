import { apiClient } from '../api-client';
import {
  LowStockNotification,
  LowStockNotificationStatus,
  ListNotificationsResponse,
} from '@/types/entities';
import {
  NotificationPreference,
  NotificationPreferences,
  NotificationPreferencesResponse,
} from '@/types/notifications';

export async function getPreferences(
  familyId: string,
  memberId: string
): Promise<NotificationPreferences> {
  const response = await apiClient.get<NotificationPreferencesResponse>(
    `/families/${familyId}/members/${memberId}/preferences/notifications`,
    true
  );

  return response.data;
}

export async function updatePreferences(
  familyId: string,
  memberId: string,
  preferences: NotificationPreference[],
  unsubscribeAllEmail?: boolean,
  expectedVersion?: number
) {
  return apiClient.patch(
    `/families/${familyId}/members/${memberId}/preferences/notifications`,
    { preferences, unsubscribeAllEmail, expectedVersion },
    true
  );
}

/**
 * Notifications API Client - Inventory HQ Frontend
 *
 * API client methods for low-stock notification operations.
 */

/**
 * List notifications for a family
 * @param familyId - The family ID
 * @param status - Optional status filter (active, resolved, acknowledged)
 * @returns Promise with list of notifications
 */
export const listNotifications = async (
  familyId: string,
  status?: LowStockNotificationStatus
): Promise<LowStockNotification[]> => {
  const params = new URLSearchParams();

  if (status) {
    params.append('status', status);
  }

  const queryString = params.toString();
  const url = `/families/${familyId}/notifications${queryString ? `?${queryString}` : ''}`;

  const response = await apiClient.get<ListNotificationsResponse>(url, true);
  return response.notifications;
};

/**
 * Acknowledge a notification (admin only)
 * @param familyId - The family ID
 * @param notificationId - The notification ID to acknowledge
 * @returns Promise with the updated notification
 */
export const acknowledgeNotification = async (
  familyId: string,
  notificationId: string
): Promise<LowStockNotification> => {
  return apiClient.post<LowStockNotification>(
    `/families/${familyId}/notifications/${notificationId}/acknowledge`,
    undefined,
    true
  );
};

/**
 * Resolve a notification (admin only)
 * @param familyId - The family ID
 * @param notificationId - The notification ID to resolve
 * @returns Promise with the updated notification
 */
export const resolveNotification = async (
  familyId: string,
  notificationId: string
): Promise<LowStockNotification> => {
  return apiClient.post<LowStockNotification>(
    `/families/${familyId}/notifications/${notificationId}/resolve`,
    undefined,
    true
  );
};

/**
 * Get count of active notifications for a family
 * @param familyId - The family ID
 * @returns Promise with count of active notifications
 */
export const getActiveNotificationCount = async (familyId: string): Promise<number> => {
  const notifications = await listNotifications(familyId, 'active');
  return notifications.length;
};

export default { getPreferences, updatePreferences };
