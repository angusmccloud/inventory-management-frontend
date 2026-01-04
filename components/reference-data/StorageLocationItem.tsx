'use client';

import { ArchiveBoxIcon } from '@/components/common/icons';
import type { StorageLocation } from '../../types/entities';
import { Button, Text } from '@/components/common';
import { MapPinIcon } from '@/components/common/icons';

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
    <div className="flex items-center px-4 py-4 hover:bg-surface-elevated dark:hover:bg-surface-elevated sm:px-6">
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MapPinIcon className="h-10 w-10 text-text-default" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-text-default">{location.name}</h3>
              {location.description && (
                <Text variant="bodySmall" className="mt-1">
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
              disabled={isDeleting}
              leftIcon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              }
            >
              Edit
            </Button>
            <Button
              variant="warning"
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
