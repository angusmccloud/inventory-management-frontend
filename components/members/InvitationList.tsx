/**
 * InvitationList Component
 * Feature: 003-member-management
 */

'use client';

import { Invitation } from '@/types/entities';
import { Badge, Button, Text } from '@/components/common';
import type { BadgeVariant } from '@/components/common';

interface InvitationListProps {
  invitations: Invitation[];
  onRevoke?: (invitationId: string) => void;
  onResend?: (invitationId: string) => void;
}

export function InvitationList({ invitations, onRevoke, onResend }: InvitationListProps) {
  if (invitations.length === 0) {
    return (
      <div className="py-12 text-center">
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
        <h3 className="mt-2 text-sm font-medium text-text-default">No pending invitations</h3>
        <Text variant="bodySmall" color="secondary" className="mt-1">
          Invite new members to start collaborating
        </Text>
      </div>
    );
  }

  const statusVariants: Record<string, BadgeVariant> = {
    pending: 'warning',
    accepted: 'success',
    expired: 'default',
    revoked: 'error',
    declined: 'warning',
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
            className="rounded-lg border border-border bg-surface p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-text-default">{invitation.email}</h4>
                  <Badge variant={roleVariants[invitation.role]} size="sm">
                    {invitation.role}
                  </Badge>
                </div>

                <div className="mb-2 flex items-center gap-2">
                  <Badge variant={statusVariants[invitation.status]} size="sm">
                    {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                  </Badge>

                  {invitation.status === 'pending' && !isExpired && (
                    <span className="text-xs text-text-secondary">
                      Expires in {expiresIn} day{expiresIn !== 1 ? 's' : ''}
                    </span>
                  )}

                  {invitation.status === 'pending' && isExpired && (
                    <span className="text-xs font-medium text-error">Expired</span>
                  )}
                </div>

                <Text variant="caption" color="secondary">
                  Invited by {invitation.invitedByName || 'Unknown'} on{' '}
                  {new Date(invitation.createdAt).toLocaleDateString()}
                </Text>

                {invitation.status === 'declined' && (
                  <Text variant="caption" color="secondary" className="mt-1">
                    {invitation.decisionSource === 'pending-detection'
                      ? 'Declined via pending flow'
                      : 'Declined'}{' '}
                    {invitation.consumedAt
                      ? `on ${new Date(invitation.consumedAt).toLocaleDateString()}`
                      : ''}
                  </Text>
                )}

                {invitation.status === 'declined' && invitation.declineReason && (
                  <Text variant="caption" color="secondary" className="mt-1">
                    Reason: {invitation.declineReason}
                  </Text>
                )}
              </div>

              <div className="ml-4 flex gap-2">
                {invitation.status === 'pending' && isExpired && onResend && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onResend(invitation.invitationId)}
                  >
                    Resend
                  </Button>
                )}

                {invitation.status === 'pending' && !isExpired && onRevoke && (
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => onRevoke(invitation.invitationId)}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
