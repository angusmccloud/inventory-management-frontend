/**
 * Invitations API Client
 * Feature: 003-member-management
 */

import { apiClient } from '../api-client';
import {
  Invitation,
  CreateInvitationRequest,
  AcceptInvitationRequest,
  ListInvitationsResponse,
  AcceptInvitationResponse,
} from '@/types/entities';

/**
 * Create a new invitation
 */
export async function createInvitation(
  familyId: string,
  request: CreateInvitationRequest
): Promise<Invitation> {
  return apiClient.post<Invitation>(`/families/${familyId}/invitations`, request);
}

/**
 * List invitations for a family
 */
export async function listInvitations(
  familyId: string,
  status: 'pending' | 'accepted' | 'expired' | 'revoked' | 'all' = 'pending'
): Promise<Invitation[]> {
  const response = await apiClient.get<ListInvitationsResponse>(
    `/families/${familyId}/invitations?status=${status}`
  );
  return response.invitations;
}

/**
 * Get invitation details
 */
export async function getInvitation(familyId: string, invitationId: string): Promise<Invitation> {
  return apiClient.get<Invitation>(`/families/${familyId}/invitations/${invitationId}`);
}

/**
 * Revoke a pending invitation
 */
export async function revokeInvitation(familyId: string, invitationId: string): Promise<void> {
  return apiClient.delete<void>(`/families/${familyId}/invitations/${invitationId}`);
}

/**
 * Accept an invitation (public endpoint, no auth required)
 */
export async function acceptInvitation(
  request: AcceptInvitationRequest
): Promise<AcceptInvitationResponse> {
  return apiClient.post<AcceptInvitationResponse>(
    '/invitations/accept',
    request,
    false // No auth required
  );
}

/**
 * Resend an expired invitation with new token and extended expiration
 */
export async function resendInvitation(
  familyId: string,
  invitationId: string
): Promise<Invitation> {
  return apiClient.post<Invitation>(
    `/families/${familyId}/invitations/${invitationId}/resend`,
    {}
  );
}
