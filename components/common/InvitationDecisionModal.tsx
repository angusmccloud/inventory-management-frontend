/**
 * Invitation decision modal (single-invite MVP).
 */

'use client';

import { useMemo } from 'react';
import { Modal, Button, Badge, Alert, Card, Text } from '@/components/common';
import type { PendingInvitation } from '@/types/invitations';

export interface InvitationDecisionModalProps {
  invite: PendingInvitation;
  isOpen: boolean;
  isSubmitting?: boolean;
  onAccept: () => void;
  onDeclineAll?: () => void;
}

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }
  return date.toLocaleDateString();
};

export const InvitationDecisionModal = ({
  invite,
  isOpen,
  isSubmitting = false,
  onAccept,
  onDeclineAll,
}: InvitationDecisionModalProps) => {
  const expirationLabel = useMemo(() => formatDate(invite.expiresAt), [invite.expiresAt]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      title="You have a pending invitation"
      size="md"
      showCloseButton={false}
      closeOnBackdrop={false}
      closeOnEsc={false}
    >
      <div className="space-y-6">
        <Text variant="body">
          {invite.inviterName} invited you to join <strong>{invite.familyName}</strong> as a{' '}
          <strong>{invite.roleOffered}</strong>.
        </Text>

        <Card elevation="low" padding="md" className="space-y-3 border border-border">
          <div className="flex items-center justify-between">
            <Text variant="bodySmall" color="secondary">
              Invitation status
            </Text>
            <Badge variant="info" size="sm">
              {invite.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <Text variant="bodySmall" color="secondary">
              Expires on
            </Text>
            <Text variant="bodySmall" weight="semibold">
              {expirationLabel}
            </Text>
          </div>
        </Card>

        {invite.requiresSwitchConfirmation && (
          <Alert severity="warning" title="Family switch confirmation required">
            Accepting this invitation will switch you to a new family. You will lose access to your
            current family unless you confirm the switch.
          </Alert>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          {onDeclineAll && (
            <Button variant="secondary" loading={isSubmitting} onClick={onDeclineAll}>
              Create my own family
            </Button>
          )}
          <Button variant="primary" loading={isSubmitting} onClick={onAccept}>
            Accept invitation
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InvitationDecisionModal;
