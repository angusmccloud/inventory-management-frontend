/**
 * StoreFilter Component
 * Feature: 002-shopping-lists
 *
 * Multi-select filter dropdown for viewing shopping list by multiple stores.
 */

'use client';

import { StoreGroupSummary } from '@/lib/api/shoppingList';
import { MultiSelect } from '@/components/common';
import type { SelectOption } from '@/components/common/Select/Select.types';

interface StoreFilterProps {
  stores: StoreGroupSummary[];
  selectedStoreIds: string[];
  onStoreChange: (storeIds: string[]) => void;
}

export default function StoreFilter({ stores, selectedStoreIds, onStoreChange }: StoreFilterProps) {
  if (!stores || stores.length === 0) {
    return null;
  }

  // Sort stores: alphabetically by name, with 'Unassigned' at the end
  const sortedStores = [...stores].sort((a, b) => {
    if (a.storeName === 'Unassigned') return 1;
    if (b.storeName === 'Unassigned') return -1;
    return a.storeName.localeCompare(b.storeName);
  });

  // Build options array for MultiSelect component
  const options: SelectOption<string>[] = sortedStores.map((store) => ({
    label: `${store.storeName} (${store.itemCount} ${store.itemCount === 1 ? 'item' : 'items'})`,
    value: store.storeId || 'unassigned',
  }));

  return (
    <div className="min-w-[250px]">
      <MultiSelect
        id="store-filter"
        label="Filter by Store"
        options={options}
        value={selectedStoreIds}
        onChange={onStoreChange}
        placeholder="All Stores"
      />
    </div>
  );
}
