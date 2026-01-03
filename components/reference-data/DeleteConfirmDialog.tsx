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
      title={`Archive ${entityType}`}
      message={`Archive ${name}? You can restore it later.`}
      confirmLabel={isDeleting ? 'Archiving...' : 'Archive'}
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      onCancel={onClose}
    />
  );
}
