/**
 * AdjustQuantity Component
 * 
 * Component for adjusting inventory item quantity.
 */

'use client';

import { useState, FormEvent } from 'react';
import { adjustInventoryQuantity } from '@/lib/api/inventory';
import { InventoryItem } from '@/types/entities';
import { Input, Button } from '@/components/common';

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
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Current quantity: <span className="font-semibold">{item.quantity}</span> {item.unit || 'units'}
        </p>
      </div>

      <div>
        <label htmlFor="adjustment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Adjustment Amount
        </label>
        <div className="mt-1 flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => setAdjustment(adjustment - 1)}
            disabled={loading}
          >
            -1
          </Button>
          <Input
            id="adjustment"
            type="number"
            value={adjustment}
            onChange={(e) => setAdjustment(Number(e.target.value))}
            className="text-center"
            disabled={loading}
          />
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => setAdjustment(adjustment + 1)}
            disabled={loading}
          >
            +1
          </Button>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          New quantity will be: <span className="font-semibold">{newQuantity}</span> {item.unit || 'units'}
        </p>
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
          {loading ? 'Adjusting...' : 'Apply Adjustment'}
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
