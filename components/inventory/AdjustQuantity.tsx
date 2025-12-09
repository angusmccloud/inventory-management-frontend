/**
 * AdjustQuantity Component
 * 
 * Component for adjusting inventory item quantity.
 */

'use client';

import { useState, FormEvent } from 'react';
import { adjustInventoryQuantity } from '@/lib/api/inventory';
import { InventoryItem } from '@/types/entities';

interface AdjustQuantityProps {
  familyId: string;
  item: InventoryItem;
  onSuccess: (item: InventoryItem) => void;
  onCancel?: () => void;
}

export default function AdjustQuantity({
  familyId,
  item,
  onSuccess,
  onCancel,
}: AdjustQuantityProps) {
  const [adjustment, setAdjustment] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const newQuantity = item.quantity + adjustment;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (adjustment === 0) {
      setError('Please enter an adjustment amount');
      return;
    }
    
    if (newQuantity < 0) {
      setError('Quantity cannot be negative');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const updatedItem = await adjustInventoryQuantity(familyId, item.itemId, {
        adjustment,
      });
      onSuccess(updatedItem);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to adjust quantity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
        <p className="mt-1 text-sm text-gray-600">
          Current quantity: <span className="font-semibold">{item.quantity}</span> {item.unit || 'units'}
        </p>
      </div>

      <div>
        <label htmlFor="adjustment" className="block text-sm font-medium text-gray-700">
          Adjustment Amount
        </label>
        <div className="mt-1 flex gap-2">
          <button
            type="button"
            onClick={() => setAdjustment(adjustment - 1)}
            disabled={loading}
            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            -1
          </button>
          <input
            id="adjustment"
            type="number"
            value={adjustment}
            onChange={(e) => setAdjustment(Number(e.target.value))}
                className="block w-full rounded-md border-0 px-3 py-2 text-center text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setAdjustment(adjustment + 1)}
            disabled={loading}
            className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            +1
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          New quantity will be: <span className="font-semibold">{newQuantity}</span> {item.unit || 'units'}
        </p>
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
          {loading ? 'Adjusting...' : 'Apply Adjustment'}
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
