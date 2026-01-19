'use client';

import * as React from 'react';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { isApiClientError } from '@/lib/api-client';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import CredentialForms from './credential-forms';
import VerificationStatus from './verification-status';
import DeleteAccountDialog from './delete-account-dialog';
import ProfileSummary from './profile-summary';
import NameForm from './name-form';
import { useUserSettings } from './useUserSettings';
import userSettingsApi from '@/lib/api/user-settings';
import { trackEvent } from '@/lib/telemetry';

export default function UserSettingsPanel() {
  const { profile, isLoading, isUpdatingName, errorMessage, updateDisplayName } = useUserSettings();
  const [profileError, setProfileError] = React.useState<string | null>(null);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const [pendingTicket, setPendingTicket] = React.useState<{ ticketId: string; expiresAt: string } | null>(null);
  const [isSubmittingEmail, setIsSubmittingEmail] = React.useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const { showSnackbar } = useSnackbar();

  const handleNameSubmit = async (displayName: string) => {
    setProfileError(null);
    try {
      await updateDisplayName(displayName);
      showSnackbar({ variant: 'success', text: 'Display name updated.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update display name.';
      setProfileError(message);
      showSnackbar({ variant: 'error', text: message });
    }
  };

  const handleEmailSubmit = async (currentPassword: string, newEmail: string) => {
    setEmailError(null);
    setIsSubmittingEmail(true);
    try {
      const ticket = await userSettingsApi.requestEmailChange(currentPassword, newEmail);
      setPendingTicket(ticket);
      showSnackbar({ variant: 'success', text: 'Verification link sent to your new email.' });
    } catch (error) {
      if (isApiClientError(error) && error.code === 'UNAUTHORIZED') {
        setEmailError('Invalid current password');
      } else {
        setEmailError('Invalid current password');
      }
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handlePasswordSubmit = async (currentPassword: string, newPassword: string) => {
    setPasswordError(null);
    setIsSubmittingPassword(true);
    try {
      await userSettingsApi.changePassword(currentPassword, newPassword);
      showSnackbar({ variant: 'success', text: 'Password updated. Please sign in again on other devices.' });
    } catch (error) {
      if (isApiClientError(error) && error.code === 'UNAUTHORIZED') {
        setPasswordError('Invalid current password');
      } else {
        setPasswordError('Invalid current password');
      }
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleDeleteConfirm = async (password: string, acknowledgement: string) => {
    setDeleteError(null);
    setIsDeleting(true);

    try {
      const ticket = await userSettingsApi.requestAccountDeletion(password, acknowledgement);
      await userSettingsApi.confirmAccountDeletion(ticket.ticketId);
      trackEvent({ name: 'user_settings_delete_success' });
      showSnackbar({ variant: 'success', text: 'Your account has been deleted.' });
      setIsDeleteDialogOpen(false);
      if (typeof window !== 'undefined') {
        window.location.href = '/login?reason=account_deleted';
      }
    } catch (error) {
      trackEvent({ name: 'user_settings_delete_failed' });
      const msg = error instanceof Error ? error.message : 'Unable to delete account.';
      setDeleteError(msg);
      showSnackbar({ variant: 'error', text: msg });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Settings"
        description="Manage your profile, email, password, and account security."
      />

      {/* Notifications now use global Snackbar; inline errors are passed into the credential forms */}

      <ProfileSummary profile={profile} isLoading={isLoading} errorMessage={errorMessage} />
      <NameForm
        displayName={profile?.displayName}
        onSubmit={handleNameSubmit}
        isSubmitting={isUpdatingName}
        errorMessage={profileError}
      />

      <CredentialForms
        onEmailSubmit={handleEmailSubmit}
        onPasswordSubmit={handlePasswordSubmit}
        isSubmittingEmail={isSubmittingEmail}
        isSubmittingPassword={isSubmittingPassword}
        emailError={emailError}
        passwordError={passwordError}
      />

      <VerificationStatus ticket={pendingTicket} />

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Delete Account</h3>
            <p className="text-sm text-text-secondary">
              Permanently remove your account and personal data. This cannot be undone.
            </p>
          </div>
          <Button variant="danger" onClick={() => setIsDeleteDialogOpen(true)}>
            Delete Account
          </Button>
        </div>
      </Card>

      <DeleteAccountDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isDeleting}
        errorMessage={deleteError}
      />
    </div>
  );
}
