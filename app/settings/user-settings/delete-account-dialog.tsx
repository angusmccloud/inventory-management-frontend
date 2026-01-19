'use client';

import * as React from 'react';
import Modal from '@/components/common/Modal/Modal';
import { Input } from '@/components/common/Input/Input';
import { Button } from '@/components/common/Button/Button';
import { Text } from '@/components/common/Text/Text';
import Alert from '@/components/common/Alert/Alert';

export type DeleteAccountDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string, acknowledgement: string) => Promise<void> | void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

export default function DeleteAccountDialog({
  open,
  onClose,
  onConfirm,
  isSubmitting = false,
  errorMessage,
}: DeleteAccountDialogProps) {
  const [password, setPassword] = React.useState('');
  const [acknowledgement, setAcknowledgement] = React.useState('');

  const handleConfirm = async () => {
    await onConfirm(password, acknowledgement);
  };

  const canSubmit = password.length > 0 && acknowledgement === 'DELETE' && !isSubmitting;

  return (
    <Modal isOpen={open} onClose={onClose} title="Delete Account" size="md">
      <div className="space-y-4">
        <Alert severity="warning" title="This action cannot be undone">
          Deleting your account permanently removes your data. If you are the last member of your family,
          all shared data will be deleted as well.
        </Alert>

        {errorMessage && (
          <Alert severity="error" title="Deletion failed">
            {errorMessage}
          </Alert>
        )}

        <Input
          label="Current Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <Input
          label="Type DELETE to confirm"
          value={acknowledgement}
          onChange={(event) => setAcknowledgement(event.target.value)}
          required
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} disabled={!canSubmit}>
            {isSubmitting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </div>

        <Text variant="bodySmall" className="text-text-secondary">
          You will be signed out immediately after deletion completes.
        </Text>
      </div>
    </Modal>
  );
}
