import { apiClient } from '../api-client';

export type ProfileSummary = {
  memberId: string;
  displayName: string;
  primaryEmail: string;
  passwordUpdatedAt: string;
  pendingEmail?: string | null;
  pendingDeletion: boolean;
  lastAuditEvent?: string;
};

export type AsyncTicketResponse = {
  ticketId: string;
  expiresAt: string;
};

export type PasswordChangeResponse = {
  passwordUpdatedAt: string;
  sessionsRevoked: boolean;
};

export type DeletionResult = {
  memberDeleted: boolean;
  familyDeleted: boolean;
  deletionReceiptId?: string;
};

export const getProfileSummary = async (): Promise<ProfileSummary> => {
  return apiClient.get<ProfileSummary>('/user-settings/me', true);
};

export const updateDisplayName = async (displayName: string): Promise<ProfileSummary> => {
  return apiClient.patch<ProfileSummary>('/user-settings/profile', { displayName }, true);
};

export const requestEmailChange = async (
  currentPassword: string,
  newEmail: string
): Promise<AsyncTicketResponse> => {
  return apiClient.post<AsyncTicketResponse>('/user-settings/email-change', { currentPassword, newEmail }, true);
};

export const confirmEmailChange = async (ticketId: string): Promise<ProfileSummary> => {
  return apiClient.post<ProfileSummary>('/user-settings/email-change/confirm', { ticketId }, false);
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<PasswordChangeResponse> => {
  return apiClient.post<PasswordChangeResponse>('/user-settings/password-change', { currentPassword, newPassword }, true);
};

export const requestAccountDeletion = async (
  currentPassword: string,
  acknowledgementText?: string
): Promise<AsyncTicketResponse> => {
  return apiClient.post<AsyncTicketResponse>(
    '/user-settings/deletion',
    { currentPassword, acknowledgementText },
    true
  );
};

export const confirmAccountDeletion = async (ticketId: string): Promise<DeletionResult> => {
  return apiClient.post<DeletionResult>('/user-settings/deletion/confirm', { ticketId }, false);
};

export default {
  getProfileSummary,
  updateDisplayName,
  requestEmailChange,
  confirmEmailChange,
  changePassword,
  requestAccountDeletion,
  confirmAccountDeletion,
};
