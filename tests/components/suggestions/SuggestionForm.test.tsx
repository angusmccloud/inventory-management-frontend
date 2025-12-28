/**
 * Component Tests for SuggestionForm
 * 
 * Tests type selection, field rendering, validation, and submission.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SuggestionForm } from '../../../components/suggestions/SuggestionForm';
import * as inventoryApi from '../../../lib/api/inventory';

// Mock the inventory API
jest.mock('../../../lib/api/inventory');

describe('SuggestionForm', () => {
  const familyId = 'test-family-id';
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const mockInventoryItems = [
    {
      itemId: 'item-1',
      familyId,
      name: 'Milk',
      quantity: 2,
      lowStockThreshold: 1,
      status: 'active',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      createdBy: 'user-1',
      updatedBy: 'user-1',
    },
    {
      itemId: 'item-2',
      familyId,
      name: 'Bread',
      quantity: 1,
      lowStockThreshold: 1,
      status: 'active',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      createdBy: 'user-1',
      updatedBy: 'user-1',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (inventoryApi.listInventoryItems as jest.Mock).mockResolvedValue({
      items: mockInventoryItems,
    });
  });

  describe('Type Selection', () => {
    it('should render type selection dropdown with both options', () => {
      render(
        <SuggestionForm
          familyId={familyId}
          onSubmit={mockOnSubmit}
        />
      );

      const typeSelect = screen.getByLabelText(/suggestion type/i);
      expect(typeSelect).toBeInTheDocument();

      // Check that both options are available
      expect(screen.getByText(/add to shopping/i)).toBeInTheDocument();
      expect(screen.getByText(/create new item/i)).toBeInTheDocument();
    });

    it('should default to add_to_shopping type', () => {
      render(
        <SuggestionForm
          familyId={familyId}
          onSubmit={mockOnSubmit}
        />
      );

      const typeSelect = screen.getByLabelText(/suggestion type/i) as HTMLSelectElement;
      expect(typeSelect.value).toBe('add_to_shopping');
    });

    it('should switch to create_item type when selected', () => {
      render(
        <SuggestionForm
          familyId={familyId}
          onSubmit={mockOnSubmit}
        />
      );

      const typeSelect = screen.getByLabelText(/suggestion type/i);
      fireEvent.change(typeSelect, { target: { value: 'create_item' } });

      expect((typeSelect as HTMLSelectElement).value).toBe('create_item');
    });
  });

  describe('Field Rendering', () => {
    it('should show item selection for add_to_shopping type', async () => {
      render(
        <SuggestionForm
          familyId={familyId}
          onSubmit={mockOnSubmit}
        />
      );

      await waitFor(() => {
        expect(screen.getByLabelText(/select item/i)).toBeInTheDocument();
      });

      expect(screen.queryByLabelText(/item name/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/quantity/i)).not.toBeInTheDocument();
    });

    it('should show proposed item fields for create_item type', () => {
      render(
        <SuggestionForm
          familyId={familyId}
          onSubmit={mockOnSubmit}
        />
      );

      const typeSelect = screen.getByLabelText(/suggestion type/i);
      fireEvent.change(typeSelect, { target: { value: 'create_item' } });

      expect(screen.getByLabelText(/item name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/low stock threshold/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/select item/i)).not.toBeInTheDocument();
    });

    it('should load and display inventory items in dropdown', async () => {
      render(
        <SuggestionForm
          familyId={familyId}
          onSubmit={mockOnSubmit}
        />
      );

      await waitFor(() => {
        expect(inventoryApi.listInventoryItems).toHaveBeenCalledWith(familyId, {
          archived: false,
        });
      });

      await waitFor(() => {
        expect(screen.getByText('Milk')).toBeInTheDocument();
        expect(screen.getByText('Bread')).toBeInTheDocument();
      });
    });

    it('should show notes field for both types', () => {
      const { rerender } = render(
        <SuggestionForm
          familyId={familyId}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();

      const typeSelect = screen.getByLabelText(/suggestion type/i);
      fireEvent.change(typeSelect, { target: { value: 'create_item' } });

      rerender(
        <SuggestionForm
          familyId={familyId}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    });

    it('should enforce 500 character limit on notes field', () => {
      render(
        <SuggestionForm
          familyId={familyId}
          onSubmit={mockOnSubmit}
        />
      );

      const notesField = screen.getByLabelText(/notes/i) as HTMLTextAreaElement;
      expect(notesField.maxLength).toBe(500);
    });
  });

  describe('Validation', () => {
    it('should require item selection for add_to_shopping type', async () => {
      render(
        <SuggestionForm
          familyId={familyId}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please select an item/i)).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should require item name for create_item type', async () => {
      render(
        <SuggestionForm
          familyId={familyId}
          onSubmit={mockOnSubmit}
        />
      );

      const typeSelect = screen.getByLabelText(/suggestion type/i);
      fireEvent.change(typeSelect, { target: { value: 'create_item' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/item name is required/i)).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should require positive quantity for create_item type', async () => {
      render(
        <SuggestionForm
          familyId={familyId}
          onSubmit={mockOnSubmit}
        />
      );

      const typeSelect = screen.getByLabelText(/suggestion type/i);
      fireEvent.change(typeSelect, { target: { value: 'create_item' } });

      const nameInput = screen.getByLabelText(/item name/i);
      fireEvent.change(nameInput, { target: { value: 'New Item' } });

      const quantityInput = screen.getByLabelText(/quantity/i);
      fireEvent.change(quantityInput, { target: { value: '0' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/quantity must be at least 1/i)).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should require positive threshold for create_item type', async () => {
      render(
        <SuggestionForm
          familyId={familyId}
          onSubmit={mockOnSubmit}
        />
      );

      const typeSelect = screen.getByLabelText(/suggestion type/i);
      fireEvent.change(typeSelect, { target: { value: 'create_item' } });

      const nameInput = screen.getByLabelText(/item name/i);
      fireEvent.change(nameInput, { target: { value: 'New Item' } });

      const thresholdInput = screen.getByLabelText(/low stock threshold/i);
      fireEvent.change(thresholdInput, { target: { value: '-1' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/threshold must be at least 1/i)).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Submission', () => {
    it('should submit add_to_shopping suggestion with valid data', async () => {
      mockOnSubmit.mockResolvedValue(undefined);

      render(
        <SuggestionForm
          familyId={familyId}
          onSubmit={mockOnSubmit}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Milk')).toBeInTheDocument();
      });

      const itemSelect = screen.getByLabelText(/select item/i);
      fireEvent.change(itemSelect, { target: { value: 'item-1' } });

      const notesField = screen.getByLabelText(/notes/i);
      fireEvent.change(notesField, { target: { value: 'Running low' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          type: 'add_to_shopping',
          itemId: 'item-1',
          notes: 'Running low',
        });
      });
    });

    it('should submit create_item suggestion with valid data', async () => {
      mockOnSubmit.mockResolvedValue(undefined);

      render(
        <SuggestionForm
          familyId={familyId}
          onSubmit={mockOnSubmit}
        />
      );

      const typeSelect = screen.getByLabelText(/suggestion type/i);
      fireEvent.change(typeSelect, { target: { value: 'create_item' } });

      const nameInput = screen.getByLabelText(/item name/i);
      fireEvent.change(nameInput, { target: { value: 'New Item' } });

      const quantityInput = screen.getByLabelText(/quantity/i);
      fireEvent.change(quantityInput, { target: { value: '10' } });

      const thresholdInput = screen.getByLabelText(/low stock threshold/i);
      fireEvent.change(thresholdInput, { target: { value: '2' } });

      const notesField = screen.getByLabelText(/notes/i);
      fireEvent.change(notesField, { target: { value: 'Seasonal item' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          type: 'create_item',
          proposedItemName: 'New Item',
          proposedQuantity: 10,
          proposedThreshold: 2,
          notes: 'Seasonal item',
        });
      });
    });

    it('should disable submit button while submitting', async () => {
      render(
        <SuggestionForm
          familyId={familyId}
          onSubmit={mockOnSubmit}
          isSubmitting={true}
        />
      );

      const submitButton = screen.getByRole('button', { name: /submitting/i });
      expect(submitButton).toBeDisabled();
    });

    it('should call onCancel when cancel button is clicked', () => {
      render(
        <SuggestionForm
          familyId={familyId}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('Prefilled Values', () => {
    it('should prefill itemId when provided', async () => {
      render(
        <SuggestionForm
          familyId={familyId}
          onSubmit={mockOnSubmit}
          prefilledItemId="item-1"
          prefilledItemName="Milk"
        />
      );

      await waitFor(() => {
        const itemSelect = screen.getByLabelText(/select item/i) as HTMLSelectElement;
        expect(itemSelect.value).toBe('item-1');
      });

      const typeSelect = screen.getByLabelText(/suggestion type/i) as HTMLSelectElement;
      expect(typeSelect.value).toBe('add_to_shopping');
    });
  });
});
