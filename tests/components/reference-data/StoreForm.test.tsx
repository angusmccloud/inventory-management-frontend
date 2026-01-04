/**
 * Component Tests for StoreForm
 * Feature: 005-reference-data
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StoreForm from '../../../components/reference-data/StoreForm';

describe('StoreForm', () => {
  const defaultProps = {
    familyId: 'family-123',
    onSubmit: jest.fn().mockResolvedValue(undefined),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render form fields with correct labels', () => {
      render(<StoreForm {...defaultProps} />);

      expect(screen.getByLabelText(/store name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    });

    it('should show empty form for new store', () => {
      render(<StoreForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/store name/i) as HTMLInputElement;
      const addressInput = screen.getByLabelText(/address/i) as HTMLTextAreaElement;

      expect(nameInput.value).toBe('');
      expect(addressInput.value).toBe('');
    });

    it('should populate form with initial data for edit mode', () => {
      const initialData = {
        id: 'store-1',
        familyId: 'family-123',
        name: 'Walmart',
        address: '123 Main St',
        version: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      render(<StoreForm {...defaultProps} initialData={initialData} />);

      const nameInput = screen.getByLabelText(/store name/i) as HTMLInputElement;
      const addressInput = screen.getByLabelText(/address/i) as HTMLTextAreaElement;

      expect(nameInput.value).toBe('Walmart');
      expect(addressInput.value).toBe('123 Main St');
    });
  });

  describe('Input Trimming', () => {
    it('should trim whitespace from name on submit', async () => {
      render(<StoreForm {...defaultProps} />);
      const nameInput = screen.getByLabelText(/store name/i);
      const submitButton = screen.getByRole('button', { name: /add store/i });

      fireEvent.change(nameInput, { target: { value: '  Walmart  ' } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          name: 'Walmart',
          address: undefined,
        });
      });
    });

    it('should trim whitespace from address on submit', async () => {
      mockCheckStoreName.mockResolvedValue({ available: true });

      render(<StoreForm {...defaultProps} />);
      const nameInput = screen.getByLabelText(/store name/i);
      const addressInput = screen.getByLabelText(/address/i);
      const submitButton = screen.getByRole('button', { name: /add store/i });

      fireEvent.change(nameInput, { target: { value: 'Walmart' } });
      fireEvent.change(addressInput, { target: { value: '  123 Main St  ' } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          name: 'Walmart',
          address: '123 Main St',
        });
      });
    });

    it('should convert empty address to undefined', async () => {
      mockCheckStoreName.mockResolvedValue({ available: true });

      render(<StoreForm {...defaultProps} />);
      const nameInput = screen.getByLabelText(/store name/i);
      const submitButton = screen.getByRole('button', { name: /add store/i });

      fireEvent.change(nameInput, { target: { value: 'Walmart' } });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          name: 'Walmart',
          address: undefined,
        });
      });
    });
  });

  describe('Character Limit', () => {
    it('should show character count', () => {
      render(<StoreForm {...defaultProps} />);
      expect(screen.getByText('0/100 characters')).toBeInTheDocument();
    });

    it('should update character count as user types', () => {
      render(<StoreForm {...defaultProps} />);
      const nameInput = screen.getByLabelText(/store name/i);

      fireEvent.change(nameInput, { target: { value: 'Walmart' } });
      expect(screen.getByText('7/100 characters')).toBeInTheDocument();
    });

    it('should enforce 100 character maxLength', () => {
      render(<StoreForm {...defaultProps} />);
      const nameInput = screen.getByLabelText(/store name/i) as HTMLInputElement;

      expect(nameInput.maxLength).toBe(100);
    });
  });

  describe('Form Actions', () => {
    it('should call onCancel when Cancel button is clicked', () => {
      render(<StoreForm {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it('should disable submit button when name is empty', () => {
      render(<StoreForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /add store/i });
      expect(submitButton).toBeDisabled();
    });

    it('should disable submit button when name is unavailable', async () => {
      mockCheckStoreName.mockResolvedValue({ available: false });

      render(<StoreForm {...defaultProps} />);
      const nameInput = screen.getByLabelText(/store name/i);

      fireEvent.change(nameInput, { target: { value: 'Walmart' } });

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /add store/i });
        expect(submitButton).toBeDisabled();
      });
    });

    it('should show "Update Store" button text in edit mode', () => {
      const initialData = {
        id: 'store-1',
        familyId: 'family-123',
        name: 'Walmart',
        version: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      render(<StoreForm {...defaultProps} initialData={initialData} />);
      expect(screen.getByRole('button', { name: /update store/i })).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display submit error message', async () => {
      mockCheckStoreName.mockResolvedValue({ available: true });
      const mockOnSubmit = jest.fn().mockRejectedValue(new Error('Network error'));

      render(<StoreForm {...defaultProps} onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/store name/i);
      fireEvent.change(nameInput, { target: { value: 'Walmart' } });

      const submitButton = await screen.findByRole('button', { name: /add store/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });
  });
});
