'use client';

import Dialog from '../common/Dialog';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'location' | 'store';
  name: string;
  isDeleting?: boolean;
}

export default function DeleteConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type, 
  name,
  isDeleting = false 
}: DeleteConfirmDialogProps) {
  const entityType = type === 'location' ? 'storage location' : 'store';

  return (
    <Dialog
      isOpen={isOpen}
      type="error"
      title={`Delete ${entityType}`}
      message={`Are you sure you want to delete "${name}"? This action cannot be undone.`}
      confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      onCancel={onClose}
    />
  );
}
