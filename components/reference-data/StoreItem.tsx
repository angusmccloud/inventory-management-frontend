'use client';

import type { Store } from '../../types/entities';
import { Button } from '@/components/common';

interface StoreItemProps {
  store: Store;
  onEdit: (store: Store) => void;
  onDelete: (store: Store) => void;
  isDeleting?: boolean;
}

export default function StoreItem({
  store,
  onEdit,
  onDelete,
  isDeleting = false,
}: StoreItemProps) {
  return (
    <div className="px-4 py-4 flex items-center sm:px-6 hover:bg-surface-elevated dark:hover:bg-surface-elevated">
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-10 w-10 text-text-default" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-text-default">
                {store.name}
              </h3>
              {store.address && (
                <p className="text-sm text-text-default mt-1">
                  {store.address}
                </p>
              )}
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(store)}
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
              onClick={() => onDelete(store)}
              disabled={isDeleting}
              loading={isDeleting}
              leftIcon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
