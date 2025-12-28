/**
 * EditItemForm Component
 * 
 * Form for editing an existing inventory item.
 */

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { updateInventoryItem } from '@/lib/api/inventory';
import { listStorageLocations, listStores } from '@/lib/api/reference-data';
import { InventoryItem, UpdateInventoryItemRequest, StorageLocation, Store } from '@/types/entities';
import { Input, Select, Button } from '@/components/common';
import type { SelectOption } from '@/components/common';

interface EditItemFormProps {
  familyId: string;
  item: InventoryItem;
  onSuccess: (item: InventoryItem) => void;
  onCancel?: () => void;
}

export default function EditItemForm({
  familyId,
  item,
  onSuccess,
  onCancel,
}: EditItemFormProps) {
  const [formData, setFormData] = useState<UpdateInventoryItemRequest>({
    name: item.name,
    quantity: item.quantity,
    unit: item.unit || '',
    locationId: item.locationId || '',
    preferredStoreId: item.preferredStoreId || '',
    lowStockThreshold: item.lowStockThreshold,
    notes: item.notes || '',
    status: item.status,
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [locations, setLocations] = useState<StorageLocation[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingReferenceData, setLoadingReferenceData] = useState<boolean>(true);

  // Load storage locations and stores
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [locationsData, storesData] = await Promise.all([
          listStorageLocations(familyId),
          listStores(familyId),
        ]);
        setLocations(locationsData);
        setStores(storesData);
      } catch (err) {
        console.error('Failed to load reference data:', err);
        // Continue with empty lists - forms will still work
      } finally {
        setLoadingReferenceData(false);
      }
    };

    loadReferenceData();
  }, [familyId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      setError('Item name is required');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const updatedItem = await updateInventoryItem(familyId, item.itemId, {
        ...formData,
        name: formData.name?.trim(),
        unit: formData.unit?.trim() || undefined,
        locationId: formData.locationId || undefined,
        preferredStoreId: formData.preferredStoreId || undefined,
        notes: formData.notes?.trim() || undefined,
      });
      onSuccess(updatedItem);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  // Convert locations and stores to SelectOption format
  const locationOptions: SelectOption[] = locations.map((loc) => ({
    label: loc.name,
    value: loc.locationId,
  }));

  const storeOptions: SelectOption[] = stores.map((store) => ({
    label: store.name,
    value: store.storeId,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            id="item-name"
            label="Item Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={loading}
          />
        </div>

        <div>
          <Input
            id="quantity"
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            min={0}
            required
            disabled={loading}
          />
        </div>

        <div>
          <Input
            id="unit"
            label="Unit"
            type="text"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            disabled={loading}
          />
        </div>

        <div>
          <Input
            id="threshold"
            label="Low Stock Threshold"
            type="number"
            value={formData.lowStockThreshold}
            onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
            min={0}
            required
            disabled={loading}
          />
        </div>

        <div>
          <Select
            id="location"
            label="Storage Location"
            options={locationOptions}
            value={formData.locationId}
            onChange={(value) => setFormData({ ...formData, locationId: value })}
            placeholder="Select a location"
            disabled={loading || loadingReferenceData}
            helpText={
              !loadingReferenceData && locations.length === 0
                ? 'No locations available. Add them in Settings.'
                : undefined
            }
          />
        </div>

        <div>
          <Select
            id="store"
            label="Preferred Store"
            options={storeOptions}
            value={formData.preferredStoreId}
            onChange={(value) => setFormData({ ...formData, preferredStoreId: value })}
            placeholder="Select a store"
            disabled={loading || loadingReferenceData}
            helpText={
              !loadingReferenceData && stores.length === 0
                ? 'No stores available. Add them in Settings.'
                : undefined
            }
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
            disabled={loading}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-error/10 p-4">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          loading={loading}
          className="flex-1"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
