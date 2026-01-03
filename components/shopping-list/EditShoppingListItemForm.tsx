/**
 * EditShoppingListItemForm Component
 * Feature: 002-shopping-lists
 * 
 * Form to edit shopping list item details.
 */

'use client';

import { useState, useEffect } from 'react';
import { ShoppingListItem, UpdateShoppingListItemRequest } from '@/lib/api/shoppingList';
import { listStores } from '@/lib/api/reference-data';
import type { Store } from '@/types/entities';
import { Input, Select, Button, Text } from '@/components/common';

interface EditShoppingListItemFormProps {
  familyId: string;
  item: ShoppingListItem;
  onSubmit: (data: UpdateShoppingListItemRequest) => Promise<void>;
  onCancel: () => void;
}

export default function EditShoppingListItemForm({ 
  familyId,
  item, 
  onSubmit, 
  onCancel 
}: EditShoppingListItemFormProps) {
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState<number | ''>(item.quantity || '');
  const [storeId, setStoreId] = useState<string>(item.storeId || '');
  const [notes, setNotes] = useState(item.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState<boolean>(true);

  // Load stores
  useEffect(() => {
    const loadStores = async () => {
      try {
        const storesData = await listStores(familyId);
        // Sort stores alphabetically by name
        const sortedStores = storesData.sort((a, b) => a.name.localeCompare(b.name));
        setStores(sortedStores);
      } catch (err) {
        console.error('Failed to load stores:', err);
        // Continue with empty list - form will still work
      } finally {
        setLoadingStores(false);
      }
    };

    loadStores();
  }, [familyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Item name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        quantity: quantity === '' ? null : Number(quantity),
        storeId: storeId || null,
        notes: notes.trim() || null,
        version: item.version,
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes('Conflict')) {
        setError('This item was updated by someone else. Please refresh and try again.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to update item');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {/* Item Name */}
        <Input
          id="edit-name"
          label="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Paper Towels, Birthday Cake"
          maxLength={100}
          required
          disabled={isSubmitting}
        />

        {/* Quantity */}
        <Input
          type="number"
          id="edit-quantity"
          label="Quantity (optional)"
          value={quantity === '' ? '' : String(quantity)}
          onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="1"
          min={1}
          disabled={isSubmitting}
        />

        {/* Store */}
        <Select
          id="edit-store"
          label="Store (optional)"
          value={storeId}
          onChange={(value) => setStoreId(value)}
          disabled={isSubmitting || loadingStores}
        >
          <option value="">Select a store</option>
          {stores.map((store) => (
            <option key={store.storeId} value={store.storeId}>
              {store.name}
            </option>
          ))}
        </Select>
        {!loadingStores && stores.length === 0 && (
          <Text variant="caption" color="secondary" className="mt-1">
            No stores available. Add them in{' '}
            <a href="/settings" className="text-primary hover:text-primary-hover">
              Settings
            </a>
          </Text>
        )}

        {/* Notes */}
        <div>
          <label htmlFor="edit-notes" className="block text-sm font-medium text-text-default">
            Notes (optional)
          </label>
          <textarea
            id="edit-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-text-default bg-surface ring-1 ring-inset ring-border placeholder:text-text-disabled focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
            placeholder="Add any notes..."
            maxLength={500}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-error/10 p-4">
          <Text variant="bodySmall" color="error">{error}</Text>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

