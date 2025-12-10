/**
 * StoreFilter Component
 * Feature: 002-shopping-lists
 * 
 * Filter dropdown for viewing shopping list by store.
 */

'use client';

import { StoreGroupSummary } from '@/lib/api/shoppingList';

interface StoreFilterProps {
  stores: StoreGroupSummary[];
  selectedStoreId: string | null | 'all';
  onStoreChange: (storeId: string | null | 'all') => void;
}

export default function StoreFilter({
  stores,
  selectedStoreId,
  onStoreChange,
}: StoreFilterProps) {
  if (!stores || stores.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="store-filter" className="block text-sm font-medium text-gray-700">
        Filter by Store:
      </label>
      <select
        id="store-filter"
        value={selectedStoreId === null ? 'unassigned' : selectedStoreId}
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'all') {
            onStoreChange('all');
          } else if (value === 'unassigned') {
            onStoreChange(null);
          } else {
            onStoreChange(value);
          }
        }}
        className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      >
        <option value="all">All Stores ({stores.reduce((sum, s) => sum + s.itemCount, 0)} items)</option>
        {stores.map((store) => (
          <option 
            key={store.storeId || 'unassigned'} 
            value={store.storeId || 'unassigned'}
          >
            {store.storeName} ({store.itemCount} items, {store.pendingCount} pending)
          </option>
        ))}
      </select>
    </div>
  );
}

