import type { MemberRole } from '@/types/entities';

export type PendingInvitationStatus = 'PENDING' | 'EXPIRED' | 'REVOKED';
export type PendingInviteDecisionAction = 'ACCEPTED' | 'DECLINED';

export interface PendingInvitation {
  inviteId: string;
  familyId: string;
  familyName: string;
  inviterName: string;
  roleOffered: MemberRole;
  expiresAt: string;
  status: PendingInvitationStatus;
  requiresSwitchConfirmation?: boolean;
  message?: string;
}

export interface ExistingMembershipSummary {
  familyId: string;
  familyName: string;
  role: MemberRole;
  status: 'ACTIVE' | 'PENDING_SWITCH' | 'SUSPENDED';
}

export interface PendingInvitationList {
  invites: PendingInvitation[];
  existingMembership?: ExistingMembershipSummary;
  decisionToken: string;
}

export interface AcceptPendingInviteRequest {
  decisionToken: string;
  switchConfirmed?: boolean;
  trackAnalytics?: boolean;
}

export interface DeclinePendingInviteRequest {
  decisionToken: string;
  reason?: string;
}

export interface DeclineAllPendingInvitesRequest {
  decisionToken: string;
  reason?: string;
}

export interface PendingInviteDecisionResponse {
  inviteId: string;
  familyId: string;
  action: PendingInviteDecisionAction;
  membershipId: string | null;
  auditId: string;
  redirect: string;
}
