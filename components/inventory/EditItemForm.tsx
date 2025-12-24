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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Item Name *
          </label>
          <input
            id="item-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Quantity *
          </label>
          <input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
            min={0}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Unit
          </label>
          <input
            id="unit"
            type="text"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Low Stock Threshold *
          </label>
          <input
            id="threshold"
            type="number"
            value={formData.lowStockThreshold}
            onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
            min={0}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Storage Location
          </label>
          <select
            id="location"
            value={formData.locationId}
            onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
            className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
            disabled={loading || loadingReferenceData}
          >
            <option value="">Select a location</option>
            {locations.map((location) => (
              <option key={location.locationId} value={location.locationId}>
                {location.name}
              </option>
            ))}
          </select>
          {!loadingReferenceData && locations.length === 0 && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              No locations available. Add them in{' '}
              <a href="/dashboard/settings/reference-data" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                Settings
              </a>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="store" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Preferred Store
          </label>
          <select
            id="store"
            value={formData.preferredStoreId}
            onChange={(e) => setFormData({ ...formData, preferredStoreId: e.target.value })}
            className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
            disabled={loading || loadingReferenceData}
          >
            <option value="">Select a store</option>
            {stores.map((store) => (
              <option key={store.storeId} value={store.storeId}>
                {store.name}
              </option>
            ))}
          </select>
          {!loadingReferenceData && stores.length === 0 && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              No stores available. Add them in{' '}
              <a href="/dashboard/settings/reference-data" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                Settings
              </a>
            </p>
          )}
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
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-md bg-blue-600 dark:bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
