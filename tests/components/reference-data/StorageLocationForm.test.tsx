/**
 * Component Tests for StorageLocationForm
 * Feature: 005-reference-data
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StorageLocationForm from '../../../components/reference-data/StorageLocationForm';

describe('StorageLocationForm', () => {
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
      render(<StorageLocationForm {...defaultProps} />);

      expect(screen.getByLabelText(/location name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    });

    it('should show empty form for new location', () => {
      render(<StorageLocationForm {...defaultProps} />);

      const nameInput = screen.getByLabelText(/location name/i) as HTMLInputElement;
      const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;

      expect(nameInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
    });

    it('should populate form with initial data for edit mode', () => {
      const initialData = {
        id: 'loc-1',
        familyId: 'family-123',
        name: 'Pantry',
        description: 'Kitchen pantry',
        version: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      render(<StorageLocationForm {...defaultProps} initialData={initialData} />);

      const nameInput = screen.getByLabelText(/location name/i) as HTMLInputElement;
      const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;

      expect(nameInput.value).toBe('Pantry');
      expect(descriptionInput.value).toBe('Kitchen pantry');
    });
  });

  describe('Real-time Validation', () => {
    it('should check name availability as user types', async () => {
      mockCheckStorageLocationName.mockResolvedValue({ available: true });
      
      render(<StorageLocationForm {...defaultProps} />);
      const nameInput = screen.getByLabelText(/location name/i);

      fireEvent.change(nameInput, { target: { value: 'Pantry' } });

      await waitFor(() => {
        expect(mockCheckStorageLocationName).toHaveBeenCalledWith('family-123', {
          name: 'Pantry',
          excludeId: undefined,
        });
      });
    });

    it('should show error when name is unavailable', async () => {
      mockCheckStorageLocationName.mockResolvedValue({ available: false });
      
      render(<StorageLocationForm {...defaultProps} />);
      const nameInput = screen.getByLabelText(/location name/i);

      fireEvent.change(nameInput, { target: { value: 'Pantry' } });

      await waitFor(() => {
        expect(screen.getByText(/this location name is already in use/i)).toBeInTheDocument();
      });
    });

    it('should pass excludeId in edit mode', async () => {
      const initialData = {
        id: 'loc-1',
        familyId: 'family-123',
        name: 'Pantry',
        version: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      render(<StorageLocationForm {...defaultProps} initialData={initialData} />);
      const nameInput = screen.getByLabelText(/location name/i);

      fireEvent.change(nameInput, { target: { value: 'Pantry Updated' } });

      await waitFor(() => {
        expect(mockCheckStorageLocationName).toHaveBeenCalledWith('family-123', {
          name: 'Pantry Updated',
          excludeId: 'loc-1',
        });
      });
    });
  });

  describe('Input Trimming', () => {
    it('should trim whitespace from name on submit', async () => {
      mockCheckStorageLocationName.mockResolvedValue({ available: true });
      
      render(<StorageLocationForm {...defaultProps} />);
      const nameInput = screen.getByLabelText(/location name/i);
      const submitButton = screen.getByRole('button', { name: /add location/i });

      fireEvent.change(nameInput, { target: { value: '  Pantry  ' } });
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          name: 'Pantry',
          description: undefined,
        });
      });
    });

    it('should trim whitespace from description on submit', async () => {
      mockCheckStorageLocationName.mockResolvedValue({ available: true });
      
      render(<StorageLocationForm {...defaultProps} />);
      const nameInput = screen.getByLabelText(/location name/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole('button', { name: /add location/i });

      fireEvent.change(nameInput, { target: { value: 'Pantry' } });
      fireEvent.change(descriptionInput, { target: { value: '  Kitchen pantry  ' } });
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          name: 'Pantry',
          description: 'Kitchen pantry',
        });
      });
    });

    it('should convert empty description to undefined', async () => {
      mockCheckStorageLocationName.mockResolvedValue({ available: true });
      
      render(<StorageLocationForm {...defaultProps} />);
      const nameInput = screen.getByLabelText(/location name/i);
      const submitButton = screen.getByRole('button', { name: /add location/i });

      fireEvent.change(nameInput, { target: { value: 'Pantry' } });
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          name: 'Pantry',
          description: undefined,
        });
      });
    });
  });

  describe('Character Limit', () => {
    it('should show character count', () => {
      render(<StorageLocationForm {...defaultProps} />);
      expect(screen.getByText('0/50 characters')).toBeInTheDocument();
    });

    it('should update character count as user types', () => {
      render(<StorageLocationForm {...defaultProps} />);
      const nameInput = screen.getByLabelText(/location name/i);

      fireEvent.change(nameInput, { target: { value: 'Pantry' } });
      expect(screen.getByText('6/50 characters')).toBeInTheDocument();
    });

    it('should enforce 50 character maxLength', () => {
      render(<StorageLocationForm {...defaultProps} />);
      const nameInput = screen.getByLabelText(/location name/i) as HTMLInputElement;

      expect(nameInput.maxLength).toBe(50);
    });
  });

  describe('Form Actions', () => {
    it('should call onCancel when Cancel button is clicked', () => {
      render(<StorageLocationForm {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it('should disable submit button when name is empty', () => {
      render(<StorageLocationForm {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /add location/i });
      expect(submitButton).toBeDisabled();
    });

    it('should disable submit button when name is unavailable', async () => {
      mockCheckStorageLocationName.mockResolvedValue({ available: false });
      
      render(<StorageLocationForm {...defaultProps} />);
      const nameInput = screen.getByLabelText(/location name/i);

      fireEvent.change(nameInput, { target: { value: 'Pantry' } });

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /add location/i });
        expect(submitButton).toBeDisabled();
      });
    });

    it('should show "Update Location" button text in edit mode', () => {
      const initialData = {
        id: 'loc-1',
        familyId: 'family-123',
        name: 'Pantry',
        version: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      render(<StorageLocationForm {...defaultProps} initialData={initialData} />);
      expect(screen.getByRole('button', { name: /update location/i })).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display submit error message', async () => {
      mockCheckStorageLocationName.mockResolvedValue({ available: true });
      const mockOnSubmit = jest.fn().mockRejectedValue(new Error('Network error'));

      render(<StorageLocationForm {...defaultProps} onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText(/location name/i);
      fireEvent.change(nameInput, { target: { value: 'Pantry' } });

      const submitButton = await screen.findByRole('button', { name: /add location/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });
  });
});
