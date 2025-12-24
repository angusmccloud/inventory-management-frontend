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

  // Sort stores: alphabetically by name, with 'Unassigned' at the end
  const sortedStores = [...stores].sort((a, b) => {
    if (a.storeName === 'Unassigned') return 1;
    if (b.storeName === 'Unassigned') return -1;
    return a.storeName.localeCompare(b.storeName);
  });

  return (
    <div className="flex flex-col">
      <label htmlFor="store-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Filter by Store
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
        className="block rounded-md border-0 px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
      >
        <option value="all">All Stores ({stores.reduce((sum, s) => sum + s.itemCount, 0)} items)</option>
        {sortedStores.map((store) => (
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

