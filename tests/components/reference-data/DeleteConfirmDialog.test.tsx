/**
 * Component Tests for DeleteConfirmDialog
 * Feature: 005-reference-data
 */

import { render, screen, fireEvent } from '@testing-library/react';
import DeleteConfirmDialog from '../../../components/reference-data/DeleteConfirmDialog';

describe('DeleteConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    type: 'location' as const,
    name: 'Pantry',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Location Type', () => {
    it('should render correct title for location', () => {
      render(<DeleteConfirmDialog {...defaultProps} />);
      expect(screen.getByText('Delete storage location')).toBeInTheDocument();
    });

    it('should display location name in confirmation message', () => {
      render(<DeleteConfirmDialog {...defaultProps} />);
      expect(screen.getByText(/Pantry/)).toBeInTheDocument();
      expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument();
    });
  });

  describe('Store Type', () => {
    it('should render correct title for store', () => {
      render(<DeleteConfirmDialog {...defaultProps} type="store" name="Walmart" />);
      expect(screen.getByText('Delete store')).toBeInTheDocument();
    });

    it('should display store name in confirmation message', () => {
      render(<DeleteConfirmDialog {...defaultProps} type="store" name="Walmart" />);
      expect(screen.getByText(/Walmart/)).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should call onConfirm when Delete button is clicked', () => {
      render(<DeleteConfirmDialog {...defaultProps} />);

      const deleteButton = screen.getByRole('button', { name: /^delete$/i });
      fireEvent.click(deleteButton);

      expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when Cancel button is clicked', () => {
      render(<DeleteConfirmDialog {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('should disable buttons when isDeleting is true', () => {
      render(<DeleteConfirmDialog {...defaultProps} isDeleting={true} />);

      const deleteButton = screen.getByRole('button', { name: /deleting/i });
      const cancelButton = screen.getByRole('button', { name: /cancel/i });

      expect(deleteButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });

    it('should show "Deleting..." text when isDeleting is true', () => {
      render(<DeleteConfirmDialog {...defaultProps} isDeleting={true} />);
      expect(screen.getByText('Deleting...')).toBeInTheDocument();
    });
  });

  describe('Dialog Visibility', () => {
    it('should render when isOpen is true', () => {
      render(<DeleteConfirmDialog {...defaultProps} isOpen={true} />);
      expect(screen.getByText('Delete storage location')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<DeleteConfirmDialog {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Delete storage location')).not.toBeInTheDocument();
    });
  });
});
