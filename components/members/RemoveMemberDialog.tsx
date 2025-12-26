/**
 * RemoveMemberDialog Component
 * Feature: 003-member-management
 */

'use client';

import { Member } from '@/types/entities';
import { Button } from '@/components/common';

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
            <h3 className="text-lg font-semibold text-gray-900">
              {isSelfRemoval ? 'Leave Family?' : 'Remove Member?'}
            </h3>
          </div>

          {isLastAdmin ? (
            <div className="mb-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ Cannot remove the last admin
                </p>
              </div>
              <p className="text-sm text-gray-600">
                At least one admin must exist in the family. Please promote another member
                to admin before removing yourself.
              </p>
            </div>
          ) : (
            <div className="mb-6">
              {isSelfRemoval ? (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Are you sure you want to leave this family? You will immediately lose
                    access to all inventory and data.
                  </p>
                  <p className="text-sm text-gray-600">
                    Another admin will need to invite you again if you want to rejoin.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-3">
                    Are you sure you want to remove <strong>{member.name}</strong> (
                    {member.email}) from the family?
                  </p>
                  <p className="text-sm text-gray-600">
                    They will immediately lose access, but items they created will be
                    preserved.
                  </p>
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
              variant="secondary"
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

