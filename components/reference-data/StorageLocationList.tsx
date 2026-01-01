'use client';

import { useState } from 'react';
import type { StorageLocation } from '../../types/entities';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { Button } from '@/components/common';

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
          {locations.map((location) => (
            <li key={location.locationId}>
              <div className="px-4 py-4 flex items-center sm:px-6 hover:bg-surface-elevated dark:hover:bg-surface-elevated">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-10 w-10 text-text-default" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-text-default">
                          {location.name}
                        </h3>
                        {location.description && (
                          <p className="text-sm text-text-default mt-1">
                            {location.description}
                          </p>
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
                        variant="danger"
                        size="sm"
                        onClick={() => openDeleteDialog(location)}
                        disabled={deletingId === location.locationId}
                        leftIcon={
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        }
                        responsiveText={{ showAt: 'md' }}
                        aria-label="Delete storage location"
                        title="Delete storage location"
                      >
                        Delete
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
