/**
 * AddItemForm Component
 * Feature: 002-shopping-lists
 * 
 * Form to add items to shopping list (from inventory or free-text).
 */

'use client';

import { useState, useEffect } from 'react';
import { AddToShoppingListRequest } from '@/lib/api/shoppingList';
import { listStores } from '@/lib/api/reference-data';
import type { Store } from '@/types/entities';
import { Input, Select, Button } from '@/components/common';

interface AddItemFormProps {
  familyId: string;
  onSubmit: (data: AddToShoppingListRequest) => Promise<void>;
  onCancel: () => void;
}

export default function AddItemForm({ familyId, onSubmit, onCancel }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [storeId, setStoreId] = useState<string>('');
  const [notes, setNotes] = useState('');
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
      });
      
      // Reset form on success
      setName('');
      setQuantity('');
      setStoreId('');
      setNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {/* Item Name */}
        <Input
          id="name"
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
          id="quantity"
          label="Quantity (optional)"
          value={quantity === '' ? '' : String(quantity)}
          onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="1"
          min={1}
          disabled={isSubmitting}
        />

        {/* Store */}
        <Select
          id="store"
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
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes (optional)
          </label>
          <textarea
            id="notes"
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
          {isSubmitting ? 'Adding...' : 'Add Item'}
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

