/**
 * StoreFilter Component
 * Feature: 002-shopping-lists
 * 
 * Filter dropdown for viewing shopping list by store.
 */

'use client';

import { StoreGroupSummary } from '@/lib/api/shoppingList';
import { Select } from '@/components/common';
import type { SelectOption } from '@/components/common/Select/Select.types';

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

  // Build options array for Select component
  const options: SelectOption<string>[] = [
    {
      label: `All Stores (${stores.reduce((sum, s) => sum + s.itemCount, 0)} items)`,
      value: 'all',
    },
    ...sortedStores.map((store) => ({
      label: `${store.storeName} (${store.itemCount} items, ${store.pendingCount} pending)`,
      value: store.storeId || 'unassigned',
    })),
  ];

  // Convert between internal state (null for unassigned) and select value (string)
  const selectValue = selectedStoreId === null ? 'unassigned' : selectedStoreId;

  const handleChange = (value: string) => {
    if (value === 'all') {
      onStoreChange('all');
    } else if (value === 'unassigned') {
      onStoreChange(null);
    } else {
      onStoreChange(value);
    }
  };

  return (
    <Select
      id="store-filter"
      label="Filter by Store"
      options={options}
      value={selectValue}
      onChange={handleChange}
    />
  );
}

