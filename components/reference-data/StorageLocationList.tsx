'use client';

import { useState } from 'react';
import { ArchiveBoxIcon } from '@heroicons/react/24/outline';
import type { StorageLocation } from '../../types/entities';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { Button, Text } from '@/components/common';

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
      <div className="bg-surface shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {[...locations].sort((a, b) => a.name.localeCompare(b.name)).map((location) => (
            <li key={location.locationId}>
              <div className="px-4 py-4 flex items-center sm:px-6 hover:bg-surface-elevated dark:hover:bg-surface-elevated">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-10 w-10 text-secondary" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <g>
                            <path d="M20.15,20.24H3.85a1,1,0,0,1-1-1V3a1,1,0,0,1,1-1h16.3a1,1,0,0,1,1,1V19.24A1,1,0,0,1,20.15,20.24Zm-15.3-2h14.3V4H4.85Z" />
                            <path d="M12,20.24a1,1,0,0,1-1-1V3a1,1,0,1,1,2,0V19.24A1,1,0,0,1,12,20.24Z" />
                            <path d="M20.15,12.09H3.85a1,1,0,1,1,0-2h16.3a1,1,0,0,1,0,2Z" />
                            <path d="M6.51,22.05a1,1,0,0,1-1-1V19.24a1,1,0,0,1,2,0v1.81A1,1,0,0,1,6.51,22.05Z" />
                            <path d="M17.49,22.05a1,1,0,0,1-1-1V19.24a1,1,0,0,1,2,0v1.81A1,1,0,0,1,17.49,22.05Z" />
                            <path d="M14.23,12.09a1,1,0,0,1-1-1V5.66a1,1,0,0,1,2,0v5.43A1,1,0,0,1,14.23,12.09Z" />
                            <path d="M17.92,12.1a1,1,0,0,1-1-.71l-1.4-4.53a1,1,0,1,1,1.91-.59l1.4,4.53a1,1,0,0,1-.66,1.25A1,1,0,0,1,17.92,12.1Z" />
                            <path d="M9.28,20.24a1,1,0,0,1-1-1V13.81a1,1,0,0,1,2,0v5.43A1,1,0,0,1,9.28,20.24Z" />
                            <path d="M17.43,20.24H14.72a1,1,0,0,1-1-1V14.72a1,1,0,0,1,1-1h2.71a1,1,0,0,1,1,1v4.52A1,1,0,0,1,17.43,20.24Zm-1.71-2h.71V15.72h-.71Z" />
                          </g>
                        </svg>
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
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(location)}
                        leftIcon={
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
