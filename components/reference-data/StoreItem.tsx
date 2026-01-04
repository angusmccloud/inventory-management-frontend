'use client';

import type { Store } from '../../types/entities';
import { Button, Text } from '@/components/common';
import { ShoppingCartIcon, PencilIcon, ArchiveBoxIcon } from '@/components/common/icons';

interface StoreItemProps {
  store: Store;
  onEdit: (store: Store) => void;
  onDelete: (store: Store) => void;
  isDeleting?: boolean;
}

export default function StoreItem({ store, onEdit, onDelete, isDeleting = false }: StoreItemProps) {
  return (
    <div className="flex items-center px-4 py-4 hover:bg-surface-elevated dark:hover:bg-surface-elevated sm:px-6">
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingCartIcon className="h-10 w-10 text-text-default" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-text-default">{store.name}</h3>
              {store.address && (
                <Text variant="bodySmall" className="mt-1">
                  {store.address}
                </Text>
              )}
            </div>
          </div>
          <div className="ml-4 flex flex-shrink-0 space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(store)}
              disabled={isDeleting}
              leftIcon={<PencilIcon className="h-4 w-4" />}
            >
              Edit
            </Button>
            <Button
              variant="warning"
              size="sm"
              onClick={() => onDelete(store)}
              disabled={isDeleting}
              loading={isDeleting}
              leftIcon={<ArchiveBoxIcon className="h-4 w-4" />}
            >
              Archive
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
