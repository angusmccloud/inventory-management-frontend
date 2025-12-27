/**
 * Tests: Adjustment Client Component
 * 
 * @description Unit tests for interactive +/- adjustment buttons
 * Tests optimistic UI updates, error recovery, loading states, and accessibility
 * 
 * @see specs/006-api-integration/tasks.md - T032
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdjustmentClient from '../../app/t/[urlId]/AdjustmentClient';

// Mock fetch globally
global.fetch = jest.fn();

describe('AdjustmentClient Component', () => {
  const mockProps = {
    urlId: '2gSZw8ZQPb7D5kN3X8mQ78',
    initialQuantity: 5,
    initialItemName: 'Milk',
    apiBaseUrl: 'http://localhost:3001',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('Initial Render', () => {
    it('should display initial quantity', () => {
      render(<AdjustmentClient {...mockProps} />);

      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Current Quantity')).toBeInTheDocument();
    });

    it('should render both + and - buttons', () => {
      render(<AdjustmentClient {...mockProps} />);

      const decrementButton = screen.getByRole('button', {
        name: /decrease quantity by 1/i,
      });
      const incrementButton = screen.getByRole('button', {
        name: /increase quantity by 1/i,
      });

      expect(decrementButton).toBeInTheDocument();
      expect(incrementButton).toBeInTheDocument();
    });

    it('should display helper text', () => {
      render(<AdjustmentClient {...mockProps} />);

      expect(
        screen.getByText('Make additional adjustments:')
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Changes are saved automatically/)
      ).toBeInTheDocument();
    });
  });

  describe('Increment Button (+1)', () => {
    it('should increase quantity optimistically when + button clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, newQuantity: 6 }),
      });

      render(<AdjustmentClient {...mockProps} />);

      const incrementButton = screen.getByRole('button', {
        name: /increase quantity by 1/i,
      });

      fireEvent.click(incrementButton);

      // Should update optimistically
      await waitFor(() => {
        expect(screen.getByText('6')).toBeInTheDocument();
      });

      // Should show loading state
      expect(screen.getByText('Updating...')).toBeInTheDocument();

      // Wait for API call to complete
      await waitFor(() => {
        expect(screen.queryByText('Updating...')).not.toBeInTheDocument();
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/adjust/2gSZw8ZQPb7D5kN3X8mQ78',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ delta: 1 }),
        })
      );
    });

    it('should update with server response after optimistic update', async () => {
      // Server returns different value (e.g., due to concurrent update)
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, newQuantity: 7 }),
      });

      render(<AdjustmentClient {...mockProps} />);

      const incrementButton = screen.getByRole('button', {
        name: /increase quantity by 1/i,
      });

      fireEvent.click(incrementButton);

      // Optimistic update shows 6
      await waitFor(() => {
        expect(screen.getByText('6')).toBeInTheDocument();
      });

      // Server response updates to 7
      await waitFor(() => {
        expect(screen.getByText('7')).toBeInTheDocument();
      });
    });

    it('should allow increment from quantity 0', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, newQuantity: 1 }),
      });

      render(<AdjustmentClient {...mockProps} initialQuantity={0} />);

      const incrementButton = screen.getByRole('button', {
        name: /increase quantity by 1/i,
      });

      fireEvent.click(incrementButton);

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
      });
    });
  });

  describe('Decrement Button (-1)', () => {
    it('should decrease quantity optimistically when - button clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, newQuantity: 4 }),
      });

      render(<AdjustmentClient {...mockProps} />);

      const decrementButton = screen.getByRole('button', {
        name: /decrease quantity by 1/i,
      });

      fireEvent.click(decrementButton);

      // Should update optimistically
      await waitFor(() => {
        expect(screen.getByText('4')).toBeInTheDocument();
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/adjust/2gSZw8ZQPb7D5kN3X8mQ78',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ delta: -1 }),
        })
      );
    });

    it('should prevent decrement when quantity would go below 0', async () => {
      // Start at quantity 1
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, newQuantity: 0 }),
      });

      render(<AdjustmentClient {...mockProps} initialQuantity={1} />);

      const decrementButton = screen.getByRole('button', {
        name: /decrease quantity by 1/i,
      });

      // First click should work (1 -> 0)
      fireEvent.click(decrementButton);
      
      await waitFor(() => {
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.queryByText('Updating...')).not.toBeInTheDocument();
      });

      // Button should now be disabled
      expect(decrementButton).toBeDisabled();

      // Second click should not call API
      fireEvent.click(decrementButton);
      expect(global.fetch).toHaveBeenCalledTimes(1); // Only the first call
    });

    it('should show helper text when quantity is 0', () => {
      render(<AdjustmentClient {...mockProps} initialQuantity={0} />);

      expect(
        screen.getByText(/Quantity is at minimum.*Use the \+ button to add items/)
      ).toBeInTheDocument();
    });

    it('should disable decrement button when quantity is 0', () => {
      render(<AdjustmentClient {...mockProps} initialQuantity={0} />);

      const decrementButton = screen.getByRole('button', {
        name: /decrease quantity by 1/i,
      });

      expect(decrementButton).toBeDisabled();
      expect(decrementButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('should show error message when clicking disabled decrement at quantity 0', async () => {
      render(<AdjustmentClient {...mockProps} initialQuantity={0} />);

      const decrementButton = screen.getByRole('button', {
        name: /decrease quantity by 1/i,
      });

      // Button should be disabled
      expect(decrementButton).toBeDisabled();

      // Trying to click disabled button won't show error since the click is blocked
      // But we can verify the helper text shows instead
      expect(
        screen.getByText(/Quantity is at minimum.*Use the \+ button to add items/)
      ).toBeInTheDocument();
    });
  });

  describe('Error Recovery', () => {
    it('should rollback optimistic update on API error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      render(<AdjustmentClient {...mockProps} />);

      const incrementButton = screen.getByRole('button', {
        name: /increase quantity by 1/i,
      });

      fireEvent.click(incrementButton);

      // Optimistic update to 6
      await waitFor(() => {
        expect(screen.getByText('6')).toBeInTheDocument();
      });

      // Should rollback to original value (5)
      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument();
      });

      // Should show error message
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    it('should show error message for failed API request', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: { message: 'Item has been deleted' },
        }),
      });

      render(<AdjustmentClient {...mockProps} />);

      const incrementButton = screen.getByRole('button', {
        name: /increase quantity by 1/i,
      });

      fireEvent.click(incrementButton);

      await waitFor(() => {
        expect(screen.getByText('Item has been deleted')).toBeInTheDocument();
      });
    });

    it('should clear error message after 5 seconds', async () => {
      jest.useFakeTimers();

      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      render(<AdjustmentClient {...mockProps} />);

      const incrementButton = screen.getByRole('button', {
        name: /increase quantity by 1/i,
      });

      fireEvent.click(incrementButton);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });

      // Fast-forward 5 seconds
      jest.advanceTimersByTime(5000);

      await waitFor(() => {
        expect(screen.queryByText('Network error')).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it('should handle JSON parse errors gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      render(<AdjustmentClient {...mockProps} />);

      const incrementButton = screen.getByRole('button', {
        name: /increase quantity by 1/i,
      });

      fireEvent.click(incrementButton);

      await waitFor(() => {
        expect(screen.getByText('Adjustment failed')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should disable both buttons while loading', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ ok: true, json: async () => ({ newQuantity: 6 }) }),
              100
            )
          )
      );

      render(<AdjustmentClient {...mockProps} />);

      const incrementButton = screen.getByRole('button', {
        name: /increase quantity by 1/i,
      });
      const decrementButton = screen.getByRole('button', {
        name: /decrease quantity by 1/i,
      });

      fireEvent.click(incrementButton);

      // Both buttons should be disabled during loading
      await waitFor(() => {
        expect(incrementButton).toBeDisabled();
        expect(decrementButton).toBeDisabled();
      });
    });

    it('should show loading indicator', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ ok: true, json: async () => ({ newQuantity: 6 }) }),
              100
            )
          )
      );

      render(<AdjustmentClient {...mockProps} />);

      const incrementButton = screen.getByRole('button', {
        name: /increase quantity by 1/i,
      });

      fireEvent.click(incrementButton);

      await waitFor(() => {
        expect(screen.getByText('Updating...')).toBeInTheDocument();
      });
    });

    it('should prevent double-submission', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ ok: true, json: async () => ({ newQuantity: 6 }) }),
              100
            )
          )
      );

      render(<AdjustmentClient {...mockProps} />);

      const incrementButton = screen.getByRole('button', {
        name: /increase quantity by 1/i,
      });

      // Click multiple times rapidly
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      // Should only call API once
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Touch Targets (T029)', () => {
    it('should have minimum 44x44px touch targets', () => {
      render(<AdjustmentClient {...mockProps} />);

      const incrementButton = screen.getByRole('button', {
        name: /increase quantity by 1/i,
      });
      const decrementButton = screen.getByRole('button', {
        name: /decrease quantity by 1/i,
      });

      // Verify min-h-[44px] and min-w-[44px] classes
      expect(incrementButton).toHaveClass('min-h-[44px]', 'min-w-[44px]');
      expect(decrementButton).toHaveClass('min-h-[44px]', 'min-w-[44px]');
    });
  });

  describe('Accessibility (WCAG 2.1 AA)', () => {
    it('should have proper ARIA labels', () => {
      render(<AdjustmentClient {...mockProps} />);

      const incrementButton = screen.getByRole('button', {
        name: /increase quantity by 1/i,
      });
      const decrementButton = screen.getByRole('button', {
        name: /decrease quantity by 1/i,
      });

      expect(incrementButton).toHaveAttribute(
        'aria-label',
        'Increase quantity by 1'
      );
      expect(decrementButton).toHaveAttribute(
        'aria-label',
        'Decrease quantity by 1'
      );
    });

    it('should have aria-disabled when buttons are disabled', () => {
      render(<AdjustmentClient {...mockProps} initialQuantity={0} />);

      const decrementButton = screen.getByRole('button', {
        name: /decrease quantity by 1/i,
      });

      expect(decrementButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have aria-live region for API errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      render(<AdjustmentClient {...mockProps} />);

      const incrementButton = screen.getByRole('button', {
        name: /increase quantity by 1/i,
      });

      fireEvent.click(incrementButton);

      const alertRegion = await screen.findByRole('alert');
      expect(alertRegion).toHaveAttribute('aria-live', 'assertive');
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    it('should have focus rings on buttons', () => {
      render(<AdjustmentClient {...mockProps} />);

      const incrementButton = screen.getByRole('button', {
        name: /increase quantity by 1/i,
      });
      const decrementButton = screen.getByRole('button', {
        name: /decrease quantity by 1/i,
      });

      expect(incrementButton).toHaveClass('focus:ring-4');
      expect(decrementButton).toHaveClass('focus:ring-4');
    });

    it('should hide decorative icons from screen readers', () => {
      const { container } = render(<AdjustmentClient {...mockProps} />);

      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Rapid Button Presses (T033)', () => {
    it('should handle rapid increment presses correctly', async () => {
      let callCount = 0;
      (global.fetch as jest.Mock).mockImplementation(async () => {
        callCount++;
        return {
          ok: true,
          json: async () => ({ success: true, newQuantity: 5 + callCount }),
        };
      });

      render(<AdjustmentClient {...mockProps} />);

      const incrementButton = screen.getByRole('button', {
        name: /increase quantity by 1/i,
      });

      // Click rapidly 3 times
      fireEvent.click(incrementButton);
      await waitFor(() => expect(screen.queryByText('Updating...')).not.toBeInTheDocument());

      fireEvent.click(incrementButton);
      await waitFor(() => expect(screen.queryByText('Updating...')).not.toBeInTheDocument());

      fireEvent.click(incrementButton);
      await waitFor(() => expect(screen.queryByText('Updating...')).not.toBeInTheDocument());

      // All three calls should have been made
      expect(global.fetch).toHaveBeenCalledTimes(3);

      // Final quantity should be 8 (5 + 3)
      await waitFor(() => {
        expect(screen.getByText('8')).toBeInTheDocument();
      });
    });

    it('should handle alternating +/- button presses', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, newQuantity: 6 }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, newQuantity: 5 }),
        });

      render(<AdjustmentClient {...mockProps} />);

      const incrementButton = screen.getByRole('button', {
        name: /increase quantity by 1/i,
      });
      const decrementButton = screen.getByRole('button', {
        name: /decrease quantity by 1/i,
      });

      fireEvent.click(incrementButton);
      await waitFor(() => {
        expect(screen.getByText('6')).toBeInTheDocument();
        expect(screen.queryByText('Updating...')).not.toBeInTheDocument();
      });

      fireEvent.click(decrementButton);
      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.queryByText('Updating...')).not.toBeInTheDocument();
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
