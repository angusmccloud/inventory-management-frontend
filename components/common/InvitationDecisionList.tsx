/**
 * Invitation decision list (multi-invite flow).
 */

'use client';

import { Button, Badge, Card, Text } from '@/components/common';
import type { PendingInvitation } from '@/types/invitations';
import { cn } from '@/lib/cn';

export interface InvitationDecisionListProps {
  invites: PendingInvitation[];
  selectedInviteId: string | null;
  expandedInviteId: string | null;
  onSelect: (inviteId: string) => void;
  onToggleDetails: (inviteId: string) => void;
}

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }
  return date.toLocaleDateString();
};

const statusVariant = (status: PendingInvitation['status']) => {
  switch (status) {
    case 'PENDING':
      return 'info';
    case 'EXPIRED':
      return 'warning';
    case 'REVOKED':
      return 'error';
    default:
      return 'default';
  }
};

export const InvitationDecisionList = ({
  invites,
  selectedInviteId,
  expandedInviteId,
  onSelect,
  onToggleDetails,
}: InvitationDecisionListProps) => {
  return (
    <div className="space-y-4">
      {invites.map((invite) => {
        const isSelected = invite.inviteId === selectedInviteId;
        const isExpanded = invite.inviteId === expandedInviteId;

        return (
          <Card
            key={invite.inviteId}
            elevation={isSelected ? 'medium' : 'low'}
            padding="md"
            className={cn(
              'border transition-shadow focus-within:ring-2 focus-within:ring-primary/40',
              isSelected ? 'border-primary bg-surface' : 'border-border'
            )}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Text variant="h4" className="text-text-default">
                    {invite.familyName}
                  </Text>
                  <Badge variant={statusVariant(invite.status)} size="sm">
                    {invite.status}
                  </Badge>
                </div>
                <Text variant="bodySmall" color="secondary">
                  Invited by {invite.inviterName} • Role: {invite.roleOffered}
                </Text>
                <Text variant="bodySmall" color="secondary">
                  Expires {formatDate(invite.expiresAt)}
                </Text>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant={isSelected ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => onSelect(invite.inviteId)}
                  aria-pressed={isSelected}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </Button>
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => onToggleDetails(invite.inviteId)}
                >
                  {isExpanded ? 'Hide details' : 'View details'}
                </Button>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-4 rounded-md border border-border bg-surface p-4">
                <Text variant="bodySmall" color="secondary">
                  Family ID: {invite.familyId}
                </Text>
                {invite.requiresSwitchConfirmation && (
                  <Text variant="bodySmall" color="secondary" className="mt-2">
                    Accepting this invitation requires confirming a family switch.
                  </Text>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default InvitationDecisionList;
