/**
 * RemoveMemberDialog Component
 * Feature: 003-member-management
 */

'use client';

import { Member } from '@/types/entities';
import Dialog from '@/components/common/Dialog';
import { Text } from '@/components/common';

interface RemoveMemberDialogProps {
  member: Member | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isRemoving: boolean;
  isSelfRemoval?: boolean;
  isLastAdmin?: boolean;
}

export function RemoveMemberDialog({
  member,
  isOpen,
  onConfirm,
  onCancel,
  isRemoving,
  isSelfRemoval = false,
  isLastAdmin = false,
}: RemoveMemberDialogProps) {
  if (!isOpen || !member) return null;

  const title = isSelfRemoval ? 'Leave Family?' : 'Remove Member?';

  if (isLastAdmin) {
    const message = (
      <div>
        <div className="mb-4 rounded-lg border border-error bg-error/10 p-4">
          <Text variant="bodySmall" color="error" weight="medium">
            ⚠️ Cannot remove the last admin
          </Text>
        </div>
        <Text variant="bodySmall" color="secondary">
          At least one admin must exist in the family. Please promote another member to admin before
          removing yourself.
        </Text>
      </div>
    );

    return (
      <Dialog
        isOpen={isOpen}
        type="error"
        title={title}
        message={message}
        confirmLabel="Close"
        onConfirm={onCancel}
        onCancel={onCancel}
      />
    );
  }

  const message = isSelfRemoval ? (
    <div>
      <Text variant="bodySmall" color="secondary" className="mb-3">
        Are you sure you want to leave this family? You will immediately lose access to all
        inventory and data.
      </Text>
      <Text variant="bodySmall" color="secondary">
        Another admin will need to invite you again if you want to rejoin.
      </Text>
    </div>
  ) : (
    <div>
      <Text variant="bodySmall" color="secondary" className="mb-3">
        Are you sure you want to remove <strong>{member.name}</strong> ({member.email}) from the
        family?
      </Text>
      <Text variant="bodySmall" color="secondary">
        They will immediately lose access, but items they created will be preserved.
      </Text>
    </div>
  );

  return (
    <Dialog
      isOpen={isOpen}
      type="warning"
      title={title}
      message={message}
      confirmLabel={
        isRemoving
          ? isSelfRemoval
            ? 'Leaving...'
            : 'Removing...'
          : isSelfRemoval
            ? 'Leave Family'
            : 'Remove Member'
      }
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
