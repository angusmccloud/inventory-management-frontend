/**
 * Notifications API Client - Family Inventory Management System Frontend
 * 
 * API client methods for low-stock notification operations.
 */

import { apiClient } from '../api-client';
import {
  LowStockNotification,
  LowStockNotificationStatus,
  ListNotificationsResponse,
} from '@/types/entities';

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
 * Get count of active notifications for a family
 * @param familyId - The family ID
 * @returns Promise with count of active notifications
 */
export const getActiveNotificationCount = async (
  familyId: string
): Promise<number> => {
  const notifications = await listNotifications(familyId, 'active');
  return notifications.length;
};