/**
 * NotificationItem Component Tests
 *
 * Tests for the NotificationItem component that displays individual
 * low-stock notifications with status badges and acknowledge actions.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import NotificationItem from '../NotificationItem';
import { LowStockNotification } from '@/types/entities';

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

describe('NotificationItem', () => {
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
    it('renders notification item name correctly', () => {
      const notification = createMockNotification({ itemName: 'Bread' });

      render(<NotificationItem notification={notification} {...defaultProps} />);

      expect(screen.getByText('Bread')).toBeInTheDocument();
    });

    it('renders current quantity and threshold', () => {
      const notification = createMockNotification({
        currentQuantity: 3,
        threshold: 10,
      });

      render(<NotificationItem notification={notification} {...defaultProps} />);

      const quantityInfo = screen.getByTestId('quantity-info');
      expect(quantityInfo).toHaveTextContent('3');
      expect(quantityInfo).toHaveTextContent('10');
    });

    it('renders created timestamp', () => {
      const notification = createMockNotification({
        createdAt: '2024-01-15T10:30:00Z',
      });

      render(<NotificationItem notification={notification} {...defaultProps} />);

      expect(screen.getByTestId('timestamp')).toBeInTheDocument();
    });

    it('renders resolved timestamp when notification is resolved', () => {
      const notification = createMockNotification({
        status: 'resolved',
        resolvedAt: '2024-01-16T14:00:00Z',
      });

      render(<NotificationItem notification={notification} {...defaultProps} />);

      expect(screen.getByTestId('resolved-timestamp')).toBeInTheDocument();
    });

    it('does not render resolved timestamp when notification is not resolved', () => {
      const notification = createMockNotification({
        status: 'active',
        resolvedAt: null,
      });

      render(<NotificationItem notification={notification} {...defaultProps} />);

      expect(screen.queryByTestId('resolved-timestamp')).not.toBeInTheDocument();
    });
  });

  describe('Status Badge', () => {
    it('displays "Active" status with red styling for active notifications', () => {
      const notification = createMockNotification({ status: 'active' });

      render(<NotificationItem notification={notification} {...defaultProps} />);

      const badge = screen.getByTestId('status-badge');
      expect(badge).toHaveTextContent('Active');
      expect(badge).toHaveClass('bg-error/10', 'text-error');
    });

    it('displays "Acknowledged" status with yellow styling for acknowledged notifications', () => {
      const notification = createMockNotification({ status: 'acknowledged' });

      render(<NotificationItem notification={notification} {...defaultProps} />);

      const badge = screen.getByTestId('status-badge');
      expect(badge).toHaveTextContent('Acknowledged');
      expect(badge).toHaveClass('bg-tertiary/10', 'text-tertiary-contrast');
    });

    it('displays "Resolved" status with green styling for resolved notifications', () => {
      const notification = createMockNotification({ status: 'resolved' });

      render(<NotificationItem notification={notification} {...defaultProps} />);

      const badge = screen.getByTestId('status-badge');
      expect(badge).toHaveTextContent('Resolved');
      expect(badge).toHaveClass('bg-secondary/10', 'text-secondary-contrast');
    });
  });

  describe('Acknowledge Button', () => {
    it('shows acknowledge button for admin users on active notifications', () => {
      const notification = createMockNotification({ status: 'active' });

      render(<NotificationItem notification={notification} {...defaultProps} isAdmin={true} />);

      expect(screen.getByTestId('acknowledge-button')).toBeInTheDocument();
    });

    it('does not show acknowledge button for non-admin users', () => {
      const notification = createMockNotification({ status: 'active' });

      render(<NotificationItem notification={notification} {...defaultProps} />);

      expect(screen.queryByTestId('acknowledge-button')).not.toBeInTheDocument();
    });

    it('does not show acknowledge button for acknowledged notifications', () => {
      const notification = createMockNotification({ status: 'acknowledged' });

      render(<NotificationItem notification={notification} {...defaultProps} isAdmin={true} />);

      expect(screen.queryByTestId('acknowledge-button')).not.toBeInTheDocument();
    });

    it('does not show acknowledge button for resolved notifications', () => {
      const notification = createMockNotification({ status: 'resolved' });

      render(<NotificationItem notification={notification} {...defaultProps} isAdmin={true} />);

      expect(screen.queryByTestId('acknowledge-button')).not.toBeInTheDocument();
    });

    it('calls onAcknowledge callback with notification ID when button is clicked', () => {
      const notification = createMockNotification({
        notificationId: 'notif-abc-123',
        status: 'active',
      });

      render(<NotificationItem notification={notification} {...defaultProps} isAdmin={true} />);

      const button = screen.getByTestId('acknowledge-button');
      fireEvent.click(button);

      expect(mockOnAcknowledge).toHaveBeenCalledTimes(1);
      expect(mockOnAcknowledge).toHaveBeenCalledWith('notif-abc-123');
    });
  });

  describe('Accessibility', () => {
    it('renders as a list item', () => {
      const notification = createMockNotification();

      render(<NotificationItem notification={notification} {...defaultProps} />);

      expect(screen.getByTestId('notification-item').tagName).toBe('LI');
    });

    it('has proper test IDs for all key elements', () => {
      const notification = createMockNotification({ status: 'active' });

      render(<NotificationItem notification={notification} {...defaultProps} isAdmin={true} />);

      expect(screen.getByTestId('notification-item')).toBeInTheDocument();
      expect(screen.getByTestId('status-badge')).toBeInTheDocument();
      expect(screen.getByTestId('quantity-info')).toBeInTheDocument();
      expect(screen.getByTestId('timestamp')).toBeInTheDocument();
      expect(screen.getByTestId('acknowledge-button')).toBeInTheDocument();
    });
  });
});
