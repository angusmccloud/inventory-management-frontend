'use client';

import { DashboardItem } from '@/types/dashboard';
import { useQuantityDebounce } from '@/hooks/useQuantityDebounce';
import { adjustDashboardItemQuantity } from '@/lib/api/dashboards';
import { IconButton } from '@/components/common/IconButton/IconButton';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Text } from '@/components/common/Text/Text';

interface DashboardItemCardProps {
  item: DashboardItem;
  dashboardId: string;
  onQuantityChange?: (itemId: string, newQuantity: number) => void;
}

export default function DashboardItemCard({ 
  item, 
  dashboardId,
  onQuantityChange 
}: DashboardItemCardProps) {
  // Use debounce hook for quantity adjustments
  const { localQuantity, adjust, hasPendingChanges, error } = useQuantityDebounce({
    itemId: item.itemId,
    initialQuantity: item.quantity,
    onFlush: async (itemId: string, delta: number) => {
      const result = await adjustDashboardItemQuantity(dashboardId, itemId, delta);
      
      // Notify parent of successful change
      if (onQuantityChange) {
        onQuantityChange(itemId, result.newQuantity);
      }
      
      return result.newQuantity;
    },
  });

  // Determine stock level status
  const getStockStatus = (): { label: string; color: string } => {
    const quantity = localQuantity;
    
    if (quantity <= 0) {
      return { 
        label: 'Out of Stock', 
        color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800' 
      };
    }
    if (item.lowStockThreshold && quantity <= item.lowStockThreshold) {
      return { 
        label: 'Low Stock', 
        color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800' 
      };
    }
    return { 
      label: 'In Stock', 
      color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800' 
    };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      {/* Item Name */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {item.name}
        </h3>
        {item.locationName && (
          <Text variant="bodySmall" color="secondary">
            📍 {item.locationName}
          </Text>
        )}
      </div>

      {/* Stock Status Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${stockStatus.color}`}>
          {stockStatus.label}
        </span>
        {hasPendingChanges && (
          <span className="ml-2 inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
            <svg className="animate-spin h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {localQuantity}
          </span>
          {item.unit && (
            <span className="text-lg text-gray-600 dark:text-gray-400">{item.unit}</span>
          )}
        </div>

        {/* Adjustment Buttons */}
        <div className="flex gap-2">
          <IconButton
            icon={<MinusIcon className="h-6 w-6" />}
            variant="secondary"
            size="md"
            onClick={() => adjust(-1)}
            disabled={localQuantity <= 0}
            aria-label="Decrease quantity"
          />
          <IconButton
            icon={<PlusIcon className="h-6 w-6" />}
            variant="primary"
            size="md"
            onClick={() => adjust(1)}
            aria-label="Increase quantity"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-800 dark:text-red-200">
          {error.message}
        </div>
      )}
    </div>
  );
}
