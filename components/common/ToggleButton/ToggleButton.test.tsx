/**
 * ToggleButton Component Tests
 * Feature: 008-common-components
 */

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToggleButton } from './ToggleButton';
import type { ToggleButtonProps } from './ToggleButton.types';

describe('ToggleButton', () => {
  const defaultProps: ToggleButtonProps = {
    checked: false,
    onChange: jest.fn(),
    label: 'Test toggle',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with label', () => {
      render(<ToggleButton {...defaultProps} />);
      expect(screen.getByText('Test toggle')).toBeInTheDocument();
    });

    it('renders with visible label different from aria-label', () => {
      render(
        <ToggleButton {...defaultProps} label="Accessibility label" visibleLabel="Display Label" />
      );
      expect(screen.getByText('Display Label')).toBeInTheDocument();
      expect(screen.getByRole('switch')).toHaveAttribute('aria-label', 'Accessibility label');
    });

    it('renders with description', () => {
      render(<ToggleButton {...defaultProps} description="This is a description" />);
      expect(screen.getByText('This is a description')).toBeInTheDocument();
    });

    it('renders with help text', () => {
      render(<ToggleButton {...defaultProps} helpText="Help text here" />);
      expect(screen.getByText('Help text here')).toBeInTheDocument();
    });

    it('renders with error message', () => {
      render(<ToggleButton {...defaultProps} error="Error message" />);
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<ToggleButton {...defaultProps} className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('applies testId', () => {
      render(<ToggleButton {...defaultProps} testId="my-toggle" />);
      expect(screen.getByTestId('my-toggle')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA role', () => {
      render(<ToggleButton {...defaultProps} />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('has proper aria-checked attribute when unchecked', () => {
      render(<ToggleButton {...defaultProps} checked={false} />);
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    });

    it('has proper aria-checked attribute when checked', () => {
      render(<ToggleButton {...defaultProps} checked={true} />);
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });

    it('has aria-label', () => {
      render(<ToggleButton {...defaultProps} label="Toggle feature" />);
      expect(screen.getByRole('switch')).toHaveAttribute('aria-label', 'Toggle feature');
    });

    it('has aria-describedby when help text is provided', () => {
      render(<ToggleButton {...defaultProps} helpText="Help text" />);
      const toggle = screen.getByRole('switch');
      const describedBy = toggle.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(document.getElementById(describedBy!)).toHaveTextContent('Help text');
    });

    it('has aria-describedby when error is provided', () => {
      render(<ToggleButton {...defaultProps} error="Error message" />);
      const toggle = screen.getByRole('switch');
      const describedBy = toggle.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(document.getElementById(describedBy!)).toHaveTextContent('Error message');
    });

    it('has aria-describedby when description is provided', () => {
      render(<ToggleButton {...defaultProps} description="Description text" />);
      const toggle = screen.getByRole('switch');
      const describedBy = toggle.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      expect(document.getElementById(describedBy!)).toHaveTextContent('Description text');
    });
  });

  describe('Interactions', () => {
    it('calls onChange when clicked', () => {
      const onChange = jest.fn();
      render(<ToggleButton {...defaultProps} onChange={onChange} checked={false} />);

      fireEvent.click(screen.getByRole('switch'));
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('toggles from checked to unchecked', () => {
      const onChange = jest.fn();
      render(<ToggleButton {...defaultProps} onChange={onChange} checked={true} />);

      fireEvent.click(screen.getByRole('switch'));
      expect(onChange).toHaveBeenCalledWith(false);
    });

    it('responds to Space key', () => {
      const onChange = jest.fn();
      render(<ToggleButton {...defaultProps} onChange={onChange} checked={false} />);

      const toggle = screen.getByRole('switch');
      fireEvent.keyDown(toggle, { key: ' ' });
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('responds to Enter key', () => {
      const onChange = jest.fn();
      render(<ToggleButton {...defaultProps} onChange={onChange} checked={false} />);

      const toggle = screen.getByRole('switch');
      fireEvent.keyDown(toggle, { key: 'Enter' });
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('does not toggle when disabled', () => {
      const onChange = jest.fn();
      render(<ToggleButton {...defaultProps} onChange={onChange} disabled />);

      fireEvent.click(screen.getByRole('switch'));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('has disabled attribute when disabled', () => {
      render(<ToggleButton {...defaultProps} disabled />);
      expect(screen.getByRole('switch')).toBeDisabled();
    });
  });

  describe('Variants', () => {
    it('applies primary variant styles', () => {
      render(<ToggleButton {...defaultProps} variant="primary" checked />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('bg-primary');
    });

    it('applies secondary variant styles', () => {
      render(<ToggleButton {...defaultProps} variant="secondary" checked />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('bg-secondary');
    });

    it('applies tertiary variant styles', () => {
      render(<ToggleButton {...defaultProps} variant="tertiary" checked />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('bg-tertiary');
    });

    it('applies success variant styles', () => {
      render(<ToggleButton {...defaultProps} variant="success" checked />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('bg-success');
    });

    it('applies warning variant styles', () => {
      render(<ToggleButton {...defaultProps} variant="warning" checked />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('bg-warning');
    });

    it('applies error variant styles', () => {
      render(<ToggleButton {...defaultProps} variant="error" checked />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('bg-error');
    });

    it('applies border background when unchecked', () => {
      render(<ToggleButton {...defaultProps} checked={false} />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('bg-border');
    });
  });

  describe('Sizes', () => {
    it('applies small size styles', () => {
      render(<ToggleButton {...defaultProps} size="sm" />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('h-5', 'w-9');
    });

    it('applies medium size styles (default)', () => {
      render(<ToggleButton {...defaultProps} size="md" />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('h-6', 'w-11');
    });

    it('applies large size styles', () => {
      render(<ToggleButton {...defaultProps} size="lg" />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('h-7', 'w-14');
    });
  });

  describe('Form Integration', () => {
    it('includes hidden input for form submission when name is provided', () => {
      render(<ToggleButton {...defaultProps} name="toggle-field" checked />);
      const hiddenInput = document.querySelector('input[type="checkbox"][name="toggle-field"]');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveAttribute('checked');
    });

    it('hidden input reflects checked state', () => {
      const { rerender } = render(
        <ToggleButton {...defaultProps} name="toggle-field" checked={false} />
      );
      let hiddenInput = document.querySelector(
        'input[type="checkbox"][name="toggle-field"]'
      ) as HTMLInputElement;
      expect(hiddenInput?.checked).toBe(false);

      rerender(<ToggleButton {...defaultProps} name="toggle-field" checked={true} />);
      hiddenInput = document.querySelector(
        'input[type="checkbox"][name="toggle-field"]'
      ) as HTMLInputElement;
      expect(hiddenInput?.checked).toBe(true);
    });
  });

  describe('Visual States', () => {
    it('shows thumb in left position when unchecked', () => {
      const { container } = render(<ToggleButton {...defaultProps} checked={false} size="md" />);
      const thumb = container.querySelector('[aria-hidden="true"]');
      expect(thumb).toHaveClass('translate-x-0.5');
    });

    it('shows thumb in right position when checked (medium)', () => {
      const { container } = render(<ToggleButton {...defaultProps} checked={true} size="md" />);
      const thumb = container.querySelector('[aria-hidden="true"]');
      expect(thumb).toHaveClass('translate-x-5');
    });

    it('shows thumb in right position when checked (small)', () => {
      const { container } = render(<ToggleButton {...defaultProps} checked={true} size="sm" />);
      const thumb = container.querySelector('[aria-hidden="true"]');
      expect(thumb).toHaveClass('translate-x-4');
    });

    it('shows thumb in right position when checked (large)', () => {
      const { container } = render(<ToggleButton {...defaultProps} checked={true} size="lg" />);
      const thumb = container.querySelector('[aria-hidden="true"]');
      expect(thumb).toHaveClass('translate-x-7');
    });

    it('applies opacity when disabled', () => {
      render(<ToggleButton {...defaultProps} disabled />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveClass('opacity-50');
    });
  });
});
