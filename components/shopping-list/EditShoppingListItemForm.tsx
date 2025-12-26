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
import { Input, Select, Button } from '@/components/common';

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
        setStores(storesData);
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
          label="Item Name *"
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
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            No stores available. Add them in{' '}
            <a href="/dashboard/settings/reference-data" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
              Settings
            </a>
          </p>
        )}

        {/* Notes */}
        <div>
          <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes (optional)
          </label>
          <textarea
            id="edit-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
            placeholder="Add any notes..."
            maxLength={500}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
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
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

