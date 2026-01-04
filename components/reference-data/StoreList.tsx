'use client';

import { useState } from 'react';
import type { Store } from '../../types/entities';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { Button, Text } from '@/components/common';
import { ShoppingCartIcon, PencilIcon, ArchiveBoxIcon } from '@/components/common/icons';

interface StoreListProps {
  stores: Store[];
  onEdit: (store: Store) => void;
  onDelete: (storeId: string) => Promise<void>;
}

export default function StoreList({ stores, onEdit, onDelete }: StoreListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    store: Store | null;
  }>({ isOpen: false, store: null });

  async function handleDeleteConfirm() {
    if (!deleteConfirm.store) return;

    setDeletingId(deleteConfirm.store.storeId);
    try {
      await onDelete(deleteConfirm.store.storeId);
      setDeleteConfirm({ isOpen: false, store: null });
    } catch (err) {
      // Error handled by parent component
    } finally {
      setDeletingId(null);
    }
  }

  function openDeleteDialog(store: Store) {
    setDeleteConfirm({ isOpen: true, store });
  }

  function closeDeleteDialog() {
    setDeleteConfirm({ isOpen: false, store: null });
  }

  return (
    <>
      <div className="overflow-hidden bg-surface shadow sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {[...stores]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((store) => (
              <li key={store.storeId}>
                <div className="flex items-center px-4 py-4 hover:bg-surface-elevated dark:hover:bg-surface-elevated sm:px-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <ShoppingCartIcon className="h-10 w-10 text-secondary" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-text-secondary">{store.name}</h3>
                          {store.address && (
                            <Text variant="bodySmall" className="mt-1 text-text-secondary">
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
                          leftIcon={<PencilIcon className="h-4 w-4" />}
                          responsiveText={{ showAt: 'md' }}
                          aria-label="Edit store"
                          title="Edit store"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => openDeleteDialog(store)}
                          disabled={deletingId === store.storeId}
                          leftIcon={<ArchiveBoxIcon className="h-4 w-4" />}
                          responsiveText={{ showAt: 'md' }}
                          aria-label="Archive store"
                          title="Archive store"
                        >
                          Archive
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>

      <DeleteConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
        type="store"
        name={deleteConfirm.store?.name || ''}
        isDeleting={deletingId === deleteConfirm.store?.storeId}
      />
    </>
  );
}
