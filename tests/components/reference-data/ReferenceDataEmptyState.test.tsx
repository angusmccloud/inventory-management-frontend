/**
 * Component Tests for ReferenceDataEmptyState
 * Feature: 005-reference-data
 */

import { render, screen, fireEvent } from '@testing-library/react';
import ReferenceDataEmptyState from '../../../components/reference-data/ReferenceDataEmptyState';

describe('ReferenceDataEmptyState', () => {
  describe('Locations Type', () => {
    it('should render correct title and description for locations', () => {
      const mockOnAdd = jest.fn();
      render(<ReferenceDataEmptyState type="locations" onAdd={mockOnAdd} />);

      expect(screen.getByText('No Storage Locations')).toBeInTheDocument();
      expect(
        screen.getByText('Add storage locations to organize where items are stored.')
      ).toBeInTheDocument();
    });

    it('should render correct button text for locations', () => {
      const mockOnAdd = jest.fn();
      render(<ReferenceDataEmptyState type="locations" onAdd={mockOnAdd} />);

      expect(screen.getByRole('button', { name: /add location/i })).toBeInTheDocument();
    });

    it('should call onAdd when button is clicked', () => {
      const mockOnAdd = jest.fn();
      render(<ReferenceDataEmptyState type="locations" onAdd={mockOnAdd} />);

      const addButton = screen.getByRole('button', { name: /add location/i });
      fireEvent.click(addButton);

      expect(mockOnAdd).toHaveBeenCalledTimes(1);
    });
  });

  describe('Stores Type', () => {
    it('should render correct title and description for stores', () => {
      const mockOnAdd = jest.fn();
      render(<ReferenceDataEmptyState type="stores" onAdd={mockOnAdd} />);

      expect(screen.getByText('No Stores')).toBeInTheDocument();
      expect(
        screen.getByText('Add stores to track where items can be purchased.')
      ).toBeInTheDocument();
    });

    it('should render correct button text for stores', () => {
      const mockOnAdd = jest.fn();
      render(<ReferenceDataEmptyState type="stores" onAdd={mockOnAdd} />);

      expect(screen.getByRole('button', { name: /add store/i })).toBeInTheDocument();
    });

    it('should call onAdd when button is clicked', () => {
      const mockOnAdd = jest.fn();
      render(<ReferenceDataEmptyState type="stores" onAdd={mockOnAdd} />);

      const addButton = screen.getByRole('button', { name: /add store/i });
      fireEvent.click(addButton);

      expect(mockOnAdd).toHaveBeenCalledTimes(1);
    });
  });
});
