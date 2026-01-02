/**
 * RemoveMemberDialog Component
 * Feature: 003-member-management
 */

'use client';

import { Member } from '@/types/entities';
import { Button, Text } from '@/components/common';

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
          onClick={onCancel}
        />

        {/* Dialog */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-secondary">
              {isSelfRemoval ? 'Leave Family?' : 'Remove Member?'}
            </h3>
          </div>

          {isLastAdmin ? (
            <div className="mb-6">
              <div className="p-4 bg-error/10 border border-error rounded-lg mb-4">
                <Text variant="bodySmall" color="error" weight="medium">
                  ⚠️ Cannot remove the last admin
                </Text>
              </div>
              <Text variant="bodySmall" color="secondary">
                At least one admin must exist in the family. Please promote another member
                to admin before removing yourself.
              </Text>
            </div>
          ) : (
            <div className="mb-6">
              {isSelfRemoval ? (
                <>
                  <Text variant="bodySmall" color="secondary" className="mb-3">
                    Are you sure you want to leave this family? You will immediately lose
                    access to all inventory and data.
                  </Text>
                  <Text variant="bodySmall" color="secondary">
                    Another admin will need to invite you again if you want to rejoin.
                  </Text>
                </>
              ) : (
                <>
                  <Text variant="bodySmall" color="secondary" className="mb-3">
                    Are you sure you want to remove <strong>{member.name}</strong> (
                    {member.email}) from the family?
                  </Text>
                  <Text variant="bodySmall" color="secondary">
                    They will immediately lose access, but items they created will be
                    preserved.
                  </Text>
                </>
              )}
            </div>
          )}

          <div className="flex gap-3">
            {!isLastAdmin && (
              <Button
                variant="danger"
                onClick={onConfirm}
                disabled={isRemoving}
                loading={isRemoving}
                className="flex-1"
              >
                {isRemoving ? 'Removing...' : isSelfRemoval ? 'Leave Family' : 'Remove Member'}
              </Button>
            )}

            <Button
              variant="danger"
              onClick={onCancel}
              disabled={isRemoving}
              className={isLastAdmin ? 'flex-1' : ''}
            >
              {isLastAdmin ? 'Close' : 'Cancel'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

