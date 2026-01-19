/**
 * Pending Invite Gate
 * Feature: 016-pending-invite-join
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  InvitationDecisionList,
  Checkbox,
  Button,
  LoadingSpinner,
  Text,
} from '@/components/common';
import { usePendingInvites } from '@/hooks/usePendingInvites';

export default function PendingInvitePage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    error,
    selectedInviteId,
    expandedInviteId,
    selectInvite,
    toggleDetails,
    acceptInvite,
    declineInvite,
    declineAll,
  } = usePendingInvites();
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [switchConfirmed, setSwitchConfirmed] = useState(false);

  const invite = useMemo(
    () => data?.invites?.find((item) => item.inviteId === selectedInviteId) ?? null,
    [data?.invites, selectedInviteId]
  );

  useEffect(() => {
    if (!isLoading && data && data.invites.length === 0) {
      router.replace('/dashboard');
    }
  }, [data, isLoading, router]);

  useEffect(() => {
    setSwitchConfirmed(false);
  }, [selectedInviteId]);

  const handleAccept = async () => {
    if (!invite || !data?.decisionToken) {
      return;
    }

    setIsSubmitting(true);
    setActionError(null);

    try {
      const response = await acceptInvite(invite.inviteId, {
        decisionToken: data.decisionToken,
        switchConfirmed: invite.requiresSwitchConfirmation ? switchConfirmed : undefined,
      });

      router.replace(response.redirect || '/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to accept invitation';
      setActionError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclineSelected = async () => {
    if (!invite || !data?.decisionToken) {
      return;
    }

    setIsDeclining(true);
    setActionError(null);

    try {
      const response = await declineInvite(invite.inviteId, {
        decisionToken: data.decisionToken,
      });
      router.replace(response.redirect || '/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to decline invitation';
      setActionError(message);
    } finally {
      setIsDeclining(false);
    }
  };

  const handleDeclineAll = async () => {
    if (!data?.decisionToken) {
      return;
    }

    setIsDeclining(true);
    setActionError(null);

    try {
      const response = await declineAll({
        decisionToken: data.decisionToken,
        reason: 'Create my own family',
      });
      router.replace(response.redirect || '/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to decline invitations';
      setActionError(message);
    } finally {
      setIsDeclining(false);
    }
  };

  const needsSwitchConfirmation = invite?.requiresSwitchConfirmation ?? false;
  const acceptDisabled =
    !invite || (needsSwitchConfirmation && !switchConfirmed) || isSubmitting || isDeclining;
  const declineDisabled = !invite || isSubmitting || isDeclining;

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="rounded-lg border border-border bg-surface p-6">
          <Text variant="h3" className="text-text-default">
            Checking your invitations
          </Text>
          <Text variant="bodySmall" color="secondary" className="mt-2">
            We are looking for any pending invitations tied to your account.
          </Text>

          {isLoading && (
            <div className="mt-6 flex items-center gap-3">
              <LoadingSpinner size="md" />
              <Text variant="bodySmall" color="secondary">
                Loading invitations...
              </Text>
            </div>
          )}
        </div>

        {data?.invites && data.invites.length > 0 && (
          <div className="rounded-lg border border-border bg-surface p-6">
            <Text variant="h4" className="text-text-default">
              Choose a family to join
            </Text>
            <Text variant="bodySmall" color="secondary" className="mt-2">
              Select one invitation to accept. The other invitations will remain pending.
            </Text>

            <div className="mt-4">
              <InvitationDecisionList
                invites={data.invites}
                selectedInviteId={selectedInviteId}
                expandedInviteId={expandedInviteId}
                onSelect={selectInvite}
                onToggleDetails={toggleDetails}
              />
            </div>
          </div>
        )}

        {invite && needsSwitchConfirmation && (
          <div className="rounded-lg border border-border bg-surface p-6">
            <Alert severity="warning" title="Confirm family switch">
              Accepting this invitation will switch your active family access.
            </Alert>
            <div className="mt-4">
              <Checkbox
                label="I understand and want to switch families."
                checked={switchConfirmed}
                onChange={setSwitchConfirmed}
              />
            </div>
          </div>
        )}

        {invite && (
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="tertiary"
              loading={isDeclining}
              disabled={declineDisabled}
              onClick={handleDeclineSelected}
            >
              Decline selected
            </Button>
            <Button
              variant="secondary"
              loading={isDeclining}
              disabled={isSubmitting || isDeclining}
              onClick={handleDeclineAll}
            >
              Create my own family
            </Button>
            <Button
              variant="primary"
              loading={isSubmitting}
              disabled={acceptDisabled}
              onClick={handleAccept}
            >
              Accept invitation
            </Button>
          </div>
        )}

        {(error || actionError) && (
          <Alert severity="error" title="Unable to continue">
            {actionError || error}
          </Alert>
        )}
      </div>
    </main>
  );
}
