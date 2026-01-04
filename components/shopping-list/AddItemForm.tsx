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
import { listInventoryItems, createInventoryItem } from '@/lib/api/inventory';
import type { Store, InventoryItem } from '@/types/entities';
import { Input, Select, Button, Autocomplete } from '@/components/common';
import { Text } from '@/components/common/Text/Text';
import { ToggleButton } from '@/components/common/ToggleButton/ToggleButton';

interface AddItemFormProps {
  familyId: string;
  onSubmit: (data: AddToShoppingListRequest, keepModalOpen?: boolean) => Promise<void>;
  onCancel: () => void;
}

export default function AddItemForm({ familyId, onSubmit, onCancel }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unit, setUnit] = useState<string>('');
  const [storeId, setStoreId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState<boolean>(true);

  // Track if user picked an existing inventory item (via autocomplete)
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(null);
  // If true for a free-text item, create a matching inventory item when submitting
  const [trackInInventory, setTrackInInventory] = useState<boolean>(false);

  // Search inventory items for autocomplete
  const searchInventoryItems = async (query: string) => {
    if (!query.trim()) return [];

    try {
      const result = await listInventoryItems(familyId, { archived: false });
      const lowerQuery = query.toLowerCase();

      // Create store lookup map for enrichment
      const storeMap = new Map<string, Store>();
      stores.forEach((store) => {
        storeMap.set(store.storeId, store);
      });

      return result.items
        .filter((item: InventoryItem) => item.name.toLowerCase().includes(lowerQuery))
        .slice(0, 10) // Limit to 10 results
        .map((item: InventoryItem) => ({
          value: item.itemId,
          label: item.name,
          metadata: {
            preferredStoreId: item.preferredStoreId,
            unit: item.unit,
          },
        }));
    } catch (error) {
      console.error('Failed to search inventory:', error);
      return [];
    }
  };

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

  const handleSubmit = async (e: React.FormEvent, keepModalOpen: boolean = false) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Item name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      // If requested, create an inventory item first (only for free-text items)
      let createdInventoryItemId: string | null = null;
      if (trackInInventory && !selectedInventoryId) {
        const created = await createInventoryItem(familyId, {
          name: name.trim(),
          quantity: 0,
          unit: unit.trim() || undefined,
          locationId: undefined,
          preferredStoreId: storeId || undefined,
          lowStockThreshold: 0,
          notes: notes.trim() || undefined,
        });
        createdInventoryItemId = created.itemId;
      }

      await onSubmit(
        {
          itemId: selectedInventoryId || createdInventoryItemId || null,
          name: name.trim(),
          quantity: quantity === '' ? null : Number(quantity),
          unit: unit.trim() || null,
          storeId: storeId || null,
          notes: notes.trim() || null,
        },
        keepModalOpen
      );

      // Reset form on success
      if (keepModalOpen) {
        // Quick add: keep store and unit, clear name/quantity/notes
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
        setUnit('');
        setStoreId('');
        setNotes('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle name change and item selection from autocomplete
  const handleNameChange = (value: string, option?: any) => {
    setName(value);
    // If an option was selected (not just typing), auto-populate the store and unit
    if (option?.metadata) {
      if (option.metadata.preferredStoreId) {
        setStoreId(option.metadata.preferredStoreId);
      }
      if (option.metadata.unit) {
        setUnit(option.metadata.unit);
      }
      if (option.value) {
        setSelectedInventoryId(option.value);
        setTrackInInventory(false);
      }
    } else {
      // free-text typing clears selection so toggle becomes available
      setSelectedInventoryId(null);
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
          <Autocomplete
            id="name"
            label="Item Name"
            value={name}
            onChange={handleNameChange}
            onSearch={searchInventoryItems}
            onKeyDown={handleNameKeyDown}
            placeholder="e.g., Paper Towels, Birthday Cake"
            maxLength={100}
            required
            disabled={isSubmitting}
            minSearchLength={2}
            emptyMessage="No matching items in inventory"
          />
          <Text variant="caption" color="secondary" className="mt-1">
            Tip: Press Enter to quickly add multiple items. Start typing to see items from your
            inventory.
          </Text>
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

        {/* Units */}
        <Input
          type="text"
          id="unit"
          label="Units (optional)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="e.g., oz, lbs, count"
          maxLength={50}
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
          <Text variant="caption" color="secondary" className="mt-1">
            No stores available. Add them in{' '}
            <a href="/settings" className="text-primary hover:text-primary-hover">
              Settings
            </a>
          </Text>
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
            className="mt-1 block w-full rounded-md border-0 bg-surface px-3 py-2 text-text-default ring-1 ring-inset ring-border placeholder:text-text-disabled focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
            placeholder="Add any notes..."
            maxLength={500}
            disabled={isSubmitting}
          />
        </div>

        {/* Track in Inventory toggle (only show for free-text/new names) */}
        {!selectedInventoryId && (
          <div className="flex items-center justify-between pt-2">
            <div>
              <Text variant="bodySmall" className="font-medium">
                Track in Inventory
              </Text>
              <Text variant="caption" color="secondary">
                Create a matching inventory item with this name, same units and preferred store.
                Threshold set to 0 and no default storage location.
              </Text>
            </div>
            <ToggleButton
              checked={trackInInventory}
              onChange={setTrackInInventory}
              label="Track in Inventory"
              visibleLabel=""
              size="md"
              variant="primary"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-error/10 p-4">
          <Text variant="bodySmall" color="error">
            {error}
          </Text>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Adding...' : 'Add Item'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
