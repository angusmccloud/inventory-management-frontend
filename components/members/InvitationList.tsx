/**
 * InvitationList Component
 * Feature: 003-member-management
 */

'use client';

import { Invitation } from '@/types/entities';
import { Badge, Button } from '@/components/common';
import type { BadgeVariant } from '@/components/common';

interface InvitationListProps {
  invitations: Invitation[];
  onRevoke?: (invitationId: string) => void;
}

export function InvitationList({ invitations, onRevoke }: InvitationListProps) {
  if (invitations.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No pending invitations</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Invite new members to start collaborating
        </p>
      </div>
    );
  }

  const statusVariants: Record<string, BadgeVariant> = {
    pending: 'warning',
    accepted: 'success',
    expired: 'default',
    revoked: 'error',
  };

  const roleVariants: Record<string, BadgeVariant> = {
    admin: 'primary',
    suggester: 'info',
  };

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => {
        const isExpired = new Date(invitation.expiresAt) < new Date();
        const expiresIn = Math.ceil(
          (new Date(invitation.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        return (
          <div
            key={invitation.invitationId}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {invitation.email}
                  </h4>
                  <Badge variant={roleVariants[invitation.role]} size="sm">
                    {invitation.role}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={statusVariants[invitation.status]} size="sm">
                    {invitation.status.charAt(0).toUpperCase() +
                      invitation.status.slice(1)}
                  </Badge>

                  {invitation.status === 'pending' && !isExpired && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Expires in {expiresIn} day{expiresIn !== 1 ? 's' : ''}
                    </span>
                  )}

                  {invitation.status === 'pending' && isExpired && (
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">Expired</span>
                  )}
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Invited by {invitation.invitedByName || 'Unknown'} on{' '}
                  {new Date(invitation.createdAt).toLocaleDateString()}
                </p>
              </div>

              {invitation.status === 'pending' && !isExpired && onRevoke && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onRevoke(invitation.invitationId)}
                  className="ml-4"
                >
                  Revoke
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

