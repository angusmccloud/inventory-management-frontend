/**
 * Tests for ShoppingListItem component
 * Feature: 002-shopping-lists
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShoppingListItemComponent from '../ShoppingListItem';
import { ShoppingListItem } from '@/lib/api/shoppingList';

describe('ShoppingListItem Component', () => {
  const mockOnToggleStatus = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnRemove = jest.fn();

  const pendingItem: ShoppingListItem = {
    shoppingItemId: 'item-123',
    familyId: 'family-456',
    itemId: null,
    name: 'Paper Towels',
    storeId: 'store-1',
    storeName: 'Whole Foods',
    status: 'pending',
    quantity: 2,
    notes: 'Prefer double-roll',
    version: 1,
    addedBy: 'member-123',
    createdAt: '2025-12-10T12:00:00Z',
    updatedAt: '2025-12-10T12:00:00Z',
  };

  const purchasedItem: ShoppingListItem = {
    ...pendingItem,
    shoppingItemId: 'item-456',
    status: 'purchased',
    version: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pending item correctly', () => {
    render(
      <ShoppingListItemComponent
        item={pendingItem}
        onToggleStatus={mockOnToggleStatus}
        onEdit={mockOnEdit}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('Paper Towels')).toBeInTheDocument();
    expect(screen.getByText('Whole Foods')).toBeInTheDocument();
    expect(screen.getByText(/Quantity:/)).toBeInTheDocument();
    expect(screen.getByText(/2/)).toBeInTheDocument();
    expect(screen.getByText('Prefer double-roll')).toBeInTheDocument();
  });

  it('renders purchased item with strikethrough', () => {
    render(
      <ShoppingListItemComponent
        item={purchasedItem}
        onToggleStatus={mockOnToggleStatus}
        onEdit={mockOnEdit}
        onRemove={mockOnRemove}
      />
    );

    const itemName = screen.getByText('Paper Towels');
    expect(itemName).toHaveClass('line-through');
    expect(screen.getByText('Purchased')).toBeInTheDocument();
  });

  it('shows unassigned label when no store', () => {
    const unassignedItem = { ...pendingItem, storeId: null, storeName: null };

    render(
      <ShoppingListItemComponent
        item={unassignedItem}
        onToggleStatus={mockOnToggleStatus}
        onEdit={mockOnEdit}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('Unassigned')).toBeInTheDocument();
  });

  it('calls onToggleStatus when checkbox is clicked', async () => {
    mockOnToggleStatus.mockResolvedValue(undefined);

    render(
      <ShoppingListItemComponent
        item={pendingItem}
        onToggleStatus={mockOnToggleStatus}
        onEdit={mockOnEdit}
        onRemove={mockOnRemove}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockOnToggleStatus).toHaveBeenCalledWith(pendingItem);
    });
  });

  it('disables checkbox while toggling', async () => {
    mockOnToggleStatus.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(
      <ShoppingListItemComponent
        item={pendingItem}
        onToggleStatus={mockOnToggleStatus}
        onEdit={mockOnEdit}
        onRemove={mockOnRemove}
      />
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    fireEvent.click(checkbox);

    // Checkbox should be disabled while toggling
    expect(checkbox.disabled).toBe(true);

    await waitFor(() => {
      expect(checkbox.disabled).toBe(false);
    });
  });

  it('shows edit and remove buttons for pending items', () => {
    render(
      <ShoppingListItemComponent
        item={pendingItem}
        onToggleStatus={mockOnToggleStatus}
        onEdit={mockOnEdit}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });

  it('hides edit and remove buttons for purchased items', () => {
    render(
      <ShoppingListItemComponent
        item={purchasedItem}
        onToggleStatus={mockOnToggleStatus}
        onEdit={mockOnEdit}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Remove')).not.toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <ShoppingListItemComponent
        item={pendingItem}
        onToggleStatus={mockOnToggleStatus}
        onEdit={mockOnEdit}
        onRemove={mockOnRemove}
      />
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(pendingItem);
  });

  it('calls onRemove when remove button is clicked', () => {
    render(
      <ShoppingListItemComponent
        item={pendingItem}
        onToggleStatus={mockOnToggleStatus}
        onEdit={mockOnEdit}
        onRemove={mockOnRemove}
      />
    );

    fireEvent.click(screen.getByText('Remove'));
    expect(mockOnRemove).toHaveBeenCalledWith(pendingItem);
  });
});
