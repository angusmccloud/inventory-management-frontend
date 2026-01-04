/**
 * QuantityControls Component Tests
 *
 * @see specs/010-streamline-quantity-controls/contracts/quantity-controls-component.md
 */

import { render, screen, fireEvent } from '@testing-library/react';
import QuantityControls from './QuantityControls';

describe('QuantityControls', () => {
  const defaultProps = {
    quantity: 5,
    onIncrement: jest.fn(),
    onDecrement: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render quantity controls with default props', () => {
      render(<QuantityControls {...defaultProps} />);

      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByLabelText(/increase quantity/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/decrease quantity/i)).toBeInTheDocument();
    });

    it('should display unit label when provided', () => {
      render(<QuantityControls {...defaultProps} unit="kg" />);

      expect(screen.getByText('5 kg')).toBeInTheDocument();
    });

    it('should apply size variant classes', () => {
      const { rerender } = render(<QuantityControls {...defaultProps} size="sm" />);
      let buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveClass('h-8', 'w-8');

      rerender(<QuantityControls {...defaultProps} size="md" />);
      buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveClass('h-11', 'w-11');

      rerender(<QuantityControls {...defaultProps} size="lg" />);
      buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveClass('h-14', 'w-14');
    });

    it('should apply custom className', () => {
      render(<QuantityControls {...defaultProps} className="custom-class" />);

      const group = screen.getByRole('group');
      expect(group).toHaveClass('custom-class');
    });
  });

  describe('User Interaction', () => {
    it('should call onIncrement when + button clicked', () => {
      render(<QuantityControls {...defaultProps} />);

      const incrementBtn = screen.getByLabelText(/increase quantity/i);
      fireEvent.click(incrementBtn);

      expect(defaultProps.onIncrement).toHaveBeenCalledTimes(1);
    });

    it('should call onDecrement when - button clicked', () => {
      render(<QuantityControls {...defaultProps} />);

      const decrementBtn = screen.getByLabelText(/decrease quantity/i);
      fireEvent.click(decrementBtn);

      expect(defaultProps.onDecrement).toHaveBeenCalledTimes(1);
    });

    it('should not call onIncrement when disabled', () => {
      render(<QuantityControls {...defaultProps} disabled />);

      const incrementBtn = screen.getByLabelText(/increase quantity/i);
      fireEvent.click(incrementBtn);

      expect(defaultProps.onIncrement).not.toHaveBeenCalled();
    });

    it('should not call onDecrement when disabled', () => {
      render(<QuantityControls {...defaultProps} disabled />);

      const decrementBtn = screen.getByLabelText(/decrease quantity/i);
      fireEvent.click(decrementBtn);

      expect(defaultProps.onDecrement).not.toHaveBeenCalled();
    });
  });

  describe('Boundary Handling', () => {
    it('should disable - button at minQuantity', () => {
      render(<QuantityControls {...defaultProps} quantity={0} minQuantity={0} />);

      const decrementBtn = screen.getByLabelText(/decrease quantity/i);
      expect(decrementBtn).toBeDisabled();
    });

    it('should enable - button above minQuantity', () => {
      render(<QuantityControls {...defaultProps} quantity={1} minQuantity={0} />);

      const decrementBtn = screen.getByLabelText(/decrease quantity/i);
      expect(decrementBtn).not.toBeDisabled();
    });

    it('should disable + button at maxQuantity', () => {
      render(<QuantityControls {...defaultProps} quantity={10} maxQuantity={10} />);

      const incrementBtn = screen.getByLabelText(/increase quantity/i);
      expect(incrementBtn).toBeDisabled();
    });

    it('should enable + button below maxQuantity', () => {
      render(<QuantityControls {...defaultProps} quantity={9} maxQuantity={10} />);

      const incrementBtn = screen.getByLabelText(/increase quantity/i);
      expect(incrementBtn).not.toBeDisabled();
    });
  });

  describe('Visual States', () => {
    it('should show pending indicator when hasPendingChanges is true', () => {
      render(<QuantityControls {...defaultProps} hasPendingChanges />);

      expect(screen.getByLabelText(/changes pending/i)).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should show loading indicator when isLoading is true', () => {
      render(<QuantityControls {...defaultProps} isLoading />);

      expect(screen.getByText(/saving\.\.\./i)).toBeInTheDocument();
    });

    it('should disable both buttons when disabled prop is true', () => {
      render(<QuantityControls {...defaultProps} disabled />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have role="group" on container', () => {
      render(<QuantityControls {...defaultProps} />);

      const group = screen.getByRole('group', { name: /quantity controls/i });
      expect(group).toBeInTheDocument();
    });

    it('should have aria-labels on buttons', () => {
      render(<QuantityControls {...defaultProps} unit="units" />);

      expect(screen.getByLabelText(/increase quantity.*current: 5 units/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/decrease quantity.*current: 5 units/i)).toBeInTheDocument();
    });

    it('should use custom accessibility labels', () => {
      render(
        <QuantityControls
          {...defaultProps}
          incrementLabel="Add more"
          decrementLabel="Remove some"
        />
      );

      expect(screen.getByLabelText(/add more/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/remove some/i)).toBeInTheDocument();
    });

    it('should have aria-live region for quantity status', () => {
      render(<QuantityControls {...defaultProps} />);

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
    });

    it('should include screen reader text for pending state', () => {
      render(<QuantityControls {...defaultProps} hasPendingChanges />);

      expect(screen.getByText(/changes pending save/i)).toHaveClass('sr-only');
    });

    it('should include screen reader text for loading state', () => {
      render(<QuantityControls {...defaultProps} isLoading />);

      expect(screen.getByText(/saving\.\.\./i)).toHaveClass('sr-only');
    });

    it('should support keyboard navigation', () => {
      render(<QuantityControls {...defaultProps} />);

      const incrementBtn = screen.getByLabelText(/increase quantity/i);
      const decrementBtn = screen.getByLabelText(/decrease quantity/i);

      incrementBtn.focus();
      expect(document.activeElement).toBe(incrementBtn);

      decrementBtn.focus();
      expect(document.activeElement).toBe(decrementBtn);
    });

    it('should have focus ring styles', () => {
      render(<QuantityControls {...defaultProps} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveClass('focus:ring-2', 'focus:ring-offset-2');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative quantities', () => {
      render(<QuantityControls {...defaultProps} quantity={-5} />);

      expect(screen.getByText('-5')).toBeInTheDocument();
    });

    it('should handle zero quantity', () => {
      render(<QuantityControls {...defaultProps} quantity={0} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle large quantities', () => {
      render(<QuantityControls {...defaultProps} quantity={9999} />);

      expect(screen.getByText('9999')).toBeInTheDocument();
    });

    it('should handle both pending and loading states', () => {
      render(<QuantityControls {...defaultProps} hasPendingChanges isLoading />);

      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText(/saving\.\.\./i)).toBeInTheDocument();
    });

    it('should handle disabled state at boundaries', () => {
      render(<QuantityControls {...defaultProps} quantity={0} minQuantity={0} maxQuantity={0} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });
});
