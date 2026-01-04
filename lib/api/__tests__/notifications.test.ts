/**
 * Notifications API Client Tests
 *
 * Tests for the notifications API client methods including
 * listNotifications, acknowledgeNotification, and getActiveNotificationCount.
 */

import {
  listNotifications,
  acknowledgeNotification,
  getActiveNotificationCount,
} from '../notifications';
import { apiClient } from '../../api-client';
import { LowStockNotification, ListNotificationsResponse } from '@/types/entities';

// Mock the apiClient module
jest.mock('../../api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

// Type the mocked functions
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

/**
 * Factory function to create mock notification data
 */
const createMockNotification = (
  overrides: Partial<LowStockNotification> = {}
): LowStockNotification => ({
  notificationId: 'notif-123',
  familyId: 'family-456',
  itemId: 'item-789',
  itemName: 'Milk',
  type: 'low_stock',
  status: 'active',
  currentQuantity: 2,
  threshold: 5,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  resolvedAt: null,
  ...overrides,
});

describe('Notifications API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listNotifications', () => {
    it('fetches notifications for a family without status filter', async () => {
      const mockNotifications: LowStockNotification[] = [
        createMockNotification({ notificationId: 'notif-1', itemName: 'Milk' }),
        createMockNotification({ notificationId: 'notif-2', itemName: 'Bread' }),
      ];

      const mockResponse: ListNotificationsResponse = {
        notifications: mockNotifications,
        total: 2,
      };

      mockedApiClient.get.mockResolvedValueOnce(mockResponse);

      const result = await listNotifications('family-123');

      expect(mockedApiClient.get).toHaveBeenCalledWith('/families/family-123/notifications', true);
      expect(result).toEqual(mockNotifications);
    });

    it('fetches notifications with active status filter', async () => {
      const mockNotifications: LowStockNotification[] = [
        createMockNotification({ status: 'active' }),
      ];

      const mockResponse: ListNotificationsResponse = {
        notifications: mockNotifications,
        total: 1,
      };

      mockedApiClient.get.mockResolvedValueOnce(mockResponse);

      const result = await listNotifications('family-123', 'active');

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        '/families/family-123/notifications?status=active',
        true
      );
      expect(result).toEqual(mockNotifications);
    });

    it('fetches notifications with resolved status filter', async () => {
      const mockNotifications: LowStockNotification[] = [
        createMockNotification({
          status: 'resolved',
          resolvedAt: '2024-01-16T12:00:00Z',
        }),
      ];

      const mockResponse: ListNotificationsResponse = {
        notifications: mockNotifications,
        total: 1,
      };

      mockedApiClient.get.mockResolvedValueOnce(mockResponse);

      const result = await listNotifications('family-123', 'resolved');

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        '/families/family-123/notifications?status=resolved',
        true
      );
      expect(result).toEqual(mockNotifications);
    });

    it('fetches notifications with acknowledged status filter', async () => {
      const mockNotifications: LowStockNotification[] = [
        createMockNotification({ status: 'acknowledged' }),
      ];

      const mockResponse: ListNotificationsResponse = {
        notifications: mockNotifications,
        total: 1,
      };

      mockedApiClient.get.mockResolvedValueOnce(mockResponse);

      const result = await listNotifications('family-123', 'acknowledged');

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        '/families/family-123/notifications?status=acknowledged',
        true
      );
      expect(result).toEqual(mockNotifications);
    });

    it('returns empty array when no notifications exist', async () => {
      const mockResponse: ListNotificationsResponse = {
        notifications: [],
        total: 0,
      };

      mockedApiClient.get.mockResolvedValueOnce(mockResponse);

      const result = await listNotifications('family-123');

      expect(result).toEqual([]);
    });

    it('propagates errors from the API client', async () => {
      const error = new Error('Network error');
      mockedApiClient.get.mockRejectedValueOnce(error);

      await expect(listNotifications('family-123')).rejects.toThrow('Network error');
    });
  });

  describe('acknowledgeNotification', () => {
    it('acknowledges a notification successfully', async () => {
      const acknowledgedNotification = createMockNotification({
        notificationId: 'notif-abc',
        status: 'acknowledged',
      });

      mockedApiClient.post.mockResolvedValueOnce(acknowledgedNotification);

      const result = await acknowledgeNotification('family-123', 'notif-abc');

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        '/families/family-123/notifications/notif-abc/acknowledge',
        undefined,
        true
      );
      expect(result).toEqual(acknowledgedNotification);
      expect(result.status).toBe('acknowledged');
    });

    it('uses correct URL format with family and notification IDs', async () => {
      const acknowledgedNotification = createMockNotification({
        status: 'acknowledged',
      });

      mockedApiClient.post.mockResolvedValueOnce(acknowledgedNotification);

      await acknowledgeNotification('my-family-id', 'my-notification-id');

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        '/families/my-family-id/notifications/my-notification-id/acknowledge',
        undefined,
        true
      );
    });

    it('propagates errors from the API client', async () => {
      const error = new Error('Unauthorized');
      mockedApiClient.post.mockRejectedValueOnce(error);

      await expect(acknowledgeNotification('family-123', 'notif-abc')).rejects.toThrow(
        'Unauthorized'
      );
    });

    it('handles 404 errors for non-existent notifications', async () => {
      const error = new Error('Notification not found');
      mockedApiClient.post.mockRejectedValueOnce(error);

      await expect(acknowledgeNotification('family-123', 'non-existent')).rejects.toThrow(
        'Notification not found'
      );
    });
  });

  describe('getActiveNotificationCount', () => {
    it('returns count of active notifications', async () => {
      const mockNotifications: LowStockNotification[] = [
        createMockNotification({ notificationId: 'notif-1', status: 'active' }),
        createMockNotification({ notificationId: 'notif-2', status: 'active' }),
        createMockNotification({ notificationId: 'notif-3', status: 'active' }),
      ];

      const mockResponse: ListNotificationsResponse = {
        notifications: mockNotifications,
        total: 3,
      };

      mockedApiClient.get.mockResolvedValueOnce(mockResponse);

      const count = await getActiveNotificationCount('family-123');

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        '/families/family-123/notifications?status=active',
        true
      );
      expect(count).toBe(3);
    });

    it('returns 0 when no active notifications exist', async () => {
      const mockResponse: ListNotificationsResponse = {
        notifications: [],
        total: 0,
      };

      mockedApiClient.get.mockResolvedValueOnce(mockResponse);

      const count = await getActiveNotificationCount('family-123');

      expect(count).toBe(0);
    });

    it('calls listNotifications with active status filter', async () => {
      const mockResponse: ListNotificationsResponse = {
        notifications: [createMockNotification({ status: 'active' })],
        total: 1,
      };

      mockedApiClient.get.mockResolvedValueOnce(mockResponse);

      await getActiveNotificationCount('family-456');

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        '/families/family-456/notifications?status=active',
        true
      );
    });

    it('propagates errors from the API client', async () => {
      const error = new Error('Server error');
      mockedApiClient.get.mockRejectedValueOnce(error);

      await expect(getActiveNotificationCount('family-123')).rejects.toThrow('Server error');
    });
  });
});
