/**
 * Members API Client
 * Feature: 003-member-management
 */

import { apiClient } from '../api-client';
import { Member, UpdateMemberRequest, ListMembersResponse } from '@/types/entities';

/**
 * List members in a family
 */
export async function listMembers(
  familyId: string,
  includeRemoved = false
): Promise<ListMembersResponse> {
  const query = includeRemoved ? '?includeRemoved=true' : '';
  return apiClient.get<ListMembersResponse>(`/families/${familyId}/members${query}`);
}

/**
 * Get member details
 */
export async function getMember(familyId: string, memberId: string): Promise<Member> {
  return apiClient.get<Member>(`/families/${familyId}/members/${memberId}`);
}

/**
 * Update member (role or name)
 */
export async function updateMember(
  familyId: string,
  memberId: string,
  request: UpdateMemberRequest
): Promise<Member> {
  return apiClient.patch<Member>(`/families/${familyId}/members/${memberId}`, request);
}

/**
 * Remove member from family
 */
export async function removeMember(
  familyId: string,
  memberId: string,
  version: number
): Promise<void> {
  return apiClient.delete<void>(`/families/${familyId}/members/${memberId}?version=${version}`);
}
