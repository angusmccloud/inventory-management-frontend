/**
 * AddItemForm Component
 * 
 * Form for adding a new inventory item.
 */

'use client';

import { useState, FormEvent } from 'react';
import { createInventoryItem } from '@/lib/api/inventory';
import { InventoryItem, CreateInventoryItemRequest } from '@/types/entities';

interface AddItemFormProps {
  familyId: string;
  onSuccess: (item: InventoryItem) => void;
  onCancel?: () => void;
}

export default function AddItemForm({
  familyId,
  onSuccess,
  onCancel,
}: AddItemFormProps) {
  const [formData, setFormData] = useState<CreateInventoryItemRequest>({
    name: '',
    quantity: 0,
    unit: '',
    locationId: '',
    preferredStoreId: '',
    lowStockThreshold: 1,
    notes: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Item name is required');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const item = await createInventoryItem(familyId, {
        ...formData,
        name: formData.name.trim(),
        unit: formData.unit?.trim() || undefined,
        locationId: formData.locationId || undefined,
        preferredStoreId: formData.preferredStoreId || undefined,
        notes: formData.notes?.trim() || undefined,
      });
      onSuccess(item);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="item-name" className="block text-sm font-medium text-gray-700">
            Item Name *
          </label>
          <input
            id="item-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., Milk, Paper Towels"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity *
          </label>
          <input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            min={0}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
            Unit
          </label>
          <input
            id="unit"
            type="text"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., gallons, rolls"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="threshold" className="block text-sm font-medium text-gray-700">
            Low Stock Threshold *
          </label>
          <input
            id="threshold"
            type="number"
            value={formData.lowStockThreshold}
            onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            min={0}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Storage Location
          </label>
          <input
            id="location"
            type="text"
            value={formData.locationId}
            onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., Pantry, Garage"
            disabled={loading}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Additional notes about this item"
            disabled={loading}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Item'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
