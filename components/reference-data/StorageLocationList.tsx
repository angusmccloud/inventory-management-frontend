'use client';

import { useState } from 'react';
import type { StorageLocation } from '../../types/entities';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { Button, Text } from '@/components/common';
import { StorageLocationIcon, ArchiveBoxIcon } from '@/components/common/icons';

interface StorageLocationListProps {
  locations: StorageLocation[];
  onEdit: (location: StorageLocation) => void;
  onDelete: (locationId: string) => Promise<void>;
}

export default function StorageLocationList({
  locations,
  onEdit,
  onDelete,
}: StorageLocationListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    location: StorageLocation | null;
  }>({ isOpen: false, location: null });

  async function handleDeleteConfirm() {
    if (!deleteConfirm.location) return;

    setDeletingId(deleteConfirm.location.locationId);
    try {
      await onDelete(deleteConfirm.location.locationId);
      setDeleteConfirm({ isOpen: false, location: null });
    } catch (err) {
      // Error handled by parent component
    } finally {
      setDeletingId(null);
    }
  }

  function openDeleteDialog(location: StorageLocation) {
    setDeleteConfirm({ isOpen: true, location });
  }

  function closeDeleteDialog() {
    setDeleteConfirm({ isOpen: false, location: null });
  }

  return (
    <>
      <div className="overflow-hidden bg-surface shadow sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {[...locations]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((location) => (
              <li key={location.locationId}>
                <div className="flex items-center px-4 py-4 hover:bg-surface-elevated dark:hover:bg-surface-elevated sm:px-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <StorageLocationIcon className="h-10 w-10 text-secondary" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-text-secondary">
                            {location.name}
                          </h3>
                          {location.description && (
                            <Text variant="bodySmall" className="mt-1 text-text-secondary">
                              {location.description}
                            </Text>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex flex-shrink-0 space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onEdit(location)}
                          leftIcon={
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          }
                          responsiveText={{ showAt: 'md' }}
                          aria-label="Edit storage location"
                          title="Edit storage location"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => openDeleteDialog(location)}
                          disabled={deletingId === location.locationId}
                          leftIcon={<ArchiveBoxIcon className="h-4 w-4" />}
                          responsiveText={{ showAt: 'md' }}
                          aria-label="Archive storage location"
                          title="Archive storage location"
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
        type="location"
        name={deleteConfirm.location?.name || ''}
        isDeleting={deletingId === deleteConfirm.location?.locationId}
      />
    </>
  );
}
