/**
 * NotificationList Component Tests
 *
 * Tests for the NotificationList component that displays a list of
 * low-stock notifications with filtering and empty state handling.
 */

import { render, screen } from '@testing-library/react';
import NotificationList from '../NotificationList';
import { LowStockNotification } from '@/types/entities';

/**
 * Factory function to create mock notification data
 */
const createMockNotification = (
  overrides: Partial<LowStockNotification> = {}
): LowStockNotification => ({
  notificationId: `notif-${Math.random().toString(36).substr(2, 9)}`,
  familyId: 'family-456',
  itemId: 'item-789',
  itemName: 'Test Item',
  type: 'low_stock',
  status: 'active',
  currentQuantity: 2,
  threshold: 5,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  resolvedAt: null,
  ...overrides,
});

/**
 * Create a list of mock notifications with different statuses
 */
const createMockNotifications = (): LowStockNotification[] => [
  createMockNotification({
    notificationId: 'notif-1',
    itemName: 'Milk',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
  }),
  createMockNotification({
    notificationId: 'notif-2',
    itemName: 'Bread',
    status: 'acknowledged',
    createdAt: '2024-01-14T09:00:00Z',
  }),
  createMockNotification({
    notificationId: 'notif-3',
    itemName: 'Eggs',
    status: 'resolved',
    createdAt: '2024-01-13T08:00:00Z',
    resolvedAt: '2024-01-14T12:00:00Z',
  }),
  createMockNotification({
    notificationId: 'notif-4',
    itemName: 'Butter',
    status: 'active',
    createdAt: '2024-01-16T11:00:00Z',
  }),
];

describe('NotificationList', () => {
  const mockOnAcknowledge = jest.fn();
  const mockOnResolve = jest.fn();
  const mockOnAddToShoppingList = jest.fn();
  const defaultProps = {
    onAcknowledge: mockOnAcknowledge,
    onResolve: mockOnResolve,
    onAddToShoppingList: mockOnAddToShoppingList,
    isAdmin: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders a list of notifications', () => {
      const notifications = createMockNotifications();

      render(<NotificationList notifications={notifications} {...defaultProps} />);

      expect(screen.getByTestId('notification-list')).toBeInTheDocument();
      expect(screen.getByText('Milk')).toBeInTheDocument();
      expect(screen.getByText('Bread')).toBeInTheDocument();
      expect(screen.getByText('Eggs')).toBeInTheDocument();
      expect(screen.getByText('Butter')).toBeInTheDocument();
    });

    it('renders all notification items', () => {
      const notifications = createMockNotifications();

      render(<NotificationList notifications={notifications} {...defaultProps} />);

      const items = screen.getAllByTestId('notification-item');
      expect(items).toHaveLength(4);
    });

    it('sorts notifications by createdAt (newest first)', () => {
      const notifications = createMockNotifications();

      render(<NotificationList notifications={notifications} {...defaultProps} />);

      const items = screen.getAllByTestId('notification-item');
      // Butter (Jan 16) should be first, then Milk (Jan 15), Bread (Jan 14), Eggs (Jan 13)
      expect(items[0]).toHaveTextContent('Butter');
      expect(items[1]).toHaveTextContent('Milk');
      expect(items[2]).toHaveTextContent('Bread');
      expect(items[3]).toHaveTextContent('Eggs');
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no notifications exist', () => {
      render(<NotificationList notifications={[]} {...defaultProps} />);

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText('No notifications')).toBeInTheDocument();
      expect(
        screen.getByText('All inventory items are above their thresholds.')
      ).toBeInTheDocument();
    });

    it('shows filtered empty state message when filter returns no results', () => {
      const notifications = [createMockNotification({ status: 'active' })];

      render(
        <NotificationList notifications={notifications} {...defaultProps} statusFilter="resolved" />
      );

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText('No resolved notifications found.')).toBeInTheDocument();
    });

    it('does not show notification list when empty', () => {
      render(<NotificationList notifications={[]} {...defaultProps} />);

      expect(screen.queryByTestId('notification-list')).not.toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('shows all notifications when statusFilter is "all"', () => {
      const notifications = createMockNotifications();

      render(
        <NotificationList notifications={notifications} {...defaultProps} statusFilter="all" />
      );

      const items = screen.getAllByTestId('notification-item');
      expect(items).toHaveLength(4);
    });

    it('shows all notifications when statusFilter is undefined', () => {
      const notifications = createMockNotifications();

      render(<NotificationList notifications={notifications} {...defaultProps} />);

      const items = screen.getAllByTestId('notification-item');
      expect(items).toHaveLength(4);
    });

    it('filters to show only active notifications', () => {
      const notifications = createMockNotifications();

      render(
        <NotificationList notifications={notifications} {...defaultProps} statusFilter="active" />
      );

      const items = screen.getAllByTestId('notification-item');
      expect(items).toHaveLength(2);
      expect(screen.getByText('Milk')).toBeInTheDocument();
      expect(screen.getByText('Butter')).toBeInTheDocument();
      expect(screen.queryByText('Bread')).not.toBeInTheDocument();
      expect(screen.queryByText('Eggs')).not.toBeInTheDocument();
    });

    it('filters to show only acknowledged notifications', () => {
      const notifications = createMockNotifications();

      render(
        <NotificationList
          notifications={notifications}
          {...defaultProps}
          statusFilter="acknowledged"
        />
      );

      const items = screen.getAllByTestId('notification-item');
      expect(items).toHaveLength(1);
      expect(screen.getByText('Bread')).toBeInTheDocument();
    });

    it('filters to show only resolved notifications', () => {
      const notifications = createMockNotifications();

      render(
        <NotificationList notifications={notifications} {...defaultProps} statusFilter="resolved" />
      );

      const items = screen.getAllByTestId('notification-item');
      expect(items).toHaveLength(1);
      expect(screen.getByText('Eggs')).toBeInTheDocument();
    });
  });

  describe('Props Passing', () => {
    it('passes isAdmin prop to NotificationItem components', () => {
      const notifications = [createMockNotification({ status: 'active', itemName: 'Milk' })];

      render(<NotificationList notifications={notifications} {...defaultProps} isAdmin={true} />);

      // Admin should see acknowledge button on active notifications
      expect(screen.getByTestId('acknowledge-button')).toBeInTheDocument();
    });

    it('passes onAcknowledge callback to NotificationItem components', () => {
      const notifications = [
        createMockNotification({
          notificationId: 'test-notif-id',
          status: 'active',
        }),
      ];

      render(<NotificationList notifications={notifications} {...defaultProps} isAdmin={true} />);

      const button = screen.getByTestId('acknowledge-button');
      button.click();

      expect(mockOnAcknowledge).toHaveBeenCalledWith('test-notif-id');
    });
  });

  describe('Accessibility', () => {
    it('renders notifications in a list with proper role', () => {
      const notifications = createMockNotifications();

      render(<NotificationList notifications={notifications} {...defaultProps} />);

      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('has proper test IDs for testing', () => {
      const notifications = createMockNotifications();

      render(<NotificationList notifications={notifications} {...defaultProps} />);

      expect(screen.getByTestId('notification-list')).toBeInTheDocument();
    });
  });
});
