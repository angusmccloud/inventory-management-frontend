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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-3 hover:shadow-lg transition-shadow">
      {/* Item Name and Stock Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex-1 min-w-0 truncate">
          {item.name}
        </h3>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${stockStatus.color}`}>
          {stockStatus.label}
        </span>
      </div>

      {/* Location */}
      {item.locationName && (
        <Text variant="bodySmall" color="secondary" className="mb-2">
          {item.locationName}
        </Text>
      )}

      {/* Quantity Controls */}
      <div className="flex items-center justify-start gap-2 mb-2">
        <IconButton
          icon={<MinusIcon className="h-4 w-4" />}
          variant="secondary"
          size="sm"
          onClick={() => adjust(-1)}
          disabled={localQuantity <= 0}
          aria-label="Decrease quantity"
        />
        <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {localQuantity}{item.unit ? ` ${item.unit}` : ''}
        </span>
        <IconButton
          icon={<PlusIcon className="h-4 w-4" />}
          variant="primary"
          size="sm"
          onClick={() => adjust(1)}
          aria-label="Increase quantity"
        />
      </div>

      {/* Saving Indicator */}
      {hasPendingChanges && (
        <div className="text-center mb-2">
          <span className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
            <svg className="animate-spin h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-800 dark:text-red-200">
          {error.message}
        </div>
      )}
    </div>
  );
}
