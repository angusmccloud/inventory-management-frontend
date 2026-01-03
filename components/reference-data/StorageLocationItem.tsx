'use client';

import { ArchiveBoxIcon } from '@heroicons/react/24/outline';
import type { StorageLocation } from '../../types/entities';
import { Button, Text } from '@/components/common';

interface StorageLocationItemProps {
  location: StorageLocation;
  onEdit: (location: StorageLocation) => void;
  onDelete: (location: StorageLocation) => void;
  isDeleting?: boolean;
}

export default function StorageLocationItem({
  location,
  onEdit,
  onDelete,
  isDeleting = false,
}: StorageLocationItemProps) {
  return (
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
                <Text variant="bodySmall" className="mt-1">
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
              disabled={isDeleting}
              leftIcon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(location)}
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
