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
  onSubmit: (data: AddToShoppingListRequest, keepModalOpen?: boolean) => Promise<void>;
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

  const handleSubmit = async (e: React.FormEvent, keepModalOpen: boolean = false) => {
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
      }, keepModalOpen);
      
      // Reset form on success
      if (keepModalOpen) {
        // Quick add: keep store, clear name/quantity/notes
        setName('');
        setQuantity('');
        setNotes('');
        // Focus back on name input for quick entry
        setTimeout(() => {
          document.getElementById('name')?.focus();
        }, 0);
      } else {
        // Normal submit: reset everything
        setName('');
        setQuantity('');
        setStoreId('');
        setNotes('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Enter key in name field for quick add
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSubmitting) {
      e.preventDefault();
      handleSubmit(e as any, true);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
      <div className="space-y-4">
        {/* Item Name */}
        <div>
          <Input
            id="name"
            label="Item Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleNameKeyDown}
            placeholder="e.g., Paper Towels, Birthday Cake"
            maxLength={100}
            required
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-text-secondary">
            Tip: Press Enter to quickly add multiple items
          </p>
        </div>

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
          <p className="mt-1 text-xs text-text-secondary">
            No stores available. Add them in{' '}
            <a href="/dashboard/settings/reference-data" className="text-primary hover:text-primary-hover">
              Settings
            </a>
          </p>
        )}

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-text-default">
            Notes (optional)
          </label>
          <textarea
            id="notes"
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
          <p className="text-sm text-error">{error}</p>
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

