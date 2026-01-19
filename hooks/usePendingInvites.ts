/**
 * Pending invitations hook (basic data + mutations).
 */

import { useCallback, useEffect, useState } from 'react';
import {
  getPendingInvitations,
  acceptPendingInvitation,
  declinePendingInvitation,
  declineAllPendingInvitations,
} from '@/lib/api/invitations';
import type {
  PendingInvitationList,
  AcceptPendingInviteRequest,
  DeclinePendingInviteRequest,
  DeclineAllPendingInvitesRequest,
  PendingInviteDecisionResponse,
} from '@/types/invitations';

interface UsePendingInvitesResult {
  data: PendingInvitationList | null;
  isLoading: boolean;
  error: string | null;
  selectedInviteId: string | null;
  expandedInviteId: string | null;
  refresh: () => Promise<void>;
  selectInvite: (inviteId: string) => void;
  toggleDetails: (inviteId: string) => void;
  acceptInvite: (
    inviteId: string,
    request: AcceptPendingInviteRequest
  ) => Promise<PendingInviteDecisionResponse>;
  declineInvite: (
    inviteId: string,
    request: DeclinePendingInviteRequest
  ) => Promise<PendingInviteDecisionResponse>;
  declineAll: (
    request: DeclineAllPendingInvitesRequest
  ) => Promise<PendingInviteDecisionResponse>;
}

export const usePendingInvites = (): UsePendingInvitesResult => {
  const [data, setData] = useState<PendingInvitationList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInviteId, setSelectedInviteId] = useState<string | null>(null);
  const [expandedInviteId, setExpandedInviteId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getPendingInvitations();
      setData(response);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load pending invites';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!selectedInviteId && data?.invites[0]) {
      setSelectedInviteId(data.invites[0].inviteId);
    }
  }, [data, selectedInviteId]);

  const selectInvite = useCallback((inviteId: string) => {
    setSelectedInviteId(inviteId);
  }, []);

  const toggleDetails = useCallback((inviteId: string) => {
    setExpandedInviteId((current) => (current === inviteId ? null : inviteId));
  }, []);

  const acceptInvite = useCallback(
    async (inviteId: string, request: AcceptPendingInviteRequest) => {
      const response = await acceptPendingInvitation(inviteId, request);
      await refresh();
      return response;
    },
    [refresh]
  );

  const declineInvite = useCallback(
    async (inviteId: string, request: DeclinePendingInviteRequest) => {
      const response = await declinePendingInvitation(inviteId, request);
      await refresh();
      return response;
    },
    [refresh]
  );

  const declineAll = useCallback(async (request: DeclineAllPendingInvitesRequest) => {
    const response = await declineAllPendingInvitations(request);
    await refresh();
    return response;
  }, [refresh]);

  return {
    data,
    isLoading,
    error,
    selectedInviteId,
    expandedInviteId,
    refresh,
    selectInvite,
    toggleDetails,
    acceptInvite,
    declineInvite,
    declineAll,
  };
};
