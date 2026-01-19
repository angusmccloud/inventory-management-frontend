'use client';

import * as React from 'react';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { Input } from '@/components/common/Input/Input';
import { Text } from '@/components/common/Text/Text';

export type CredentialFormsProps = {
  onEmailSubmit?: (currentPassword: string, newEmail: string) => Promise<void> | void;
  onPasswordSubmit?: (currentPassword: string, newPassword: string) => Promise<void> | void;
  isSubmittingEmail?: boolean;
  isSubmittingPassword?: boolean;
  emailError?: string | null;
  passwordError?: string | null;
};

export default function CredentialForms({
  onEmailSubmit,
  onPasswordSubmit,
  isSubmittingEmail = false,
  isSubmittingPassword = false,
  emailError = null,
  passwordError = null,
}: CredentialFormsProps) {
  const [currentEmailPassword, setCurrentEmailPassword] = React.useState('');
  const [newEmail, setNewEmail] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onEmailSubmit?.(currentEmailPassword, newEmail);
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onPasswordSubmit?.(currentPassword, newPassword);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <div>
            <Text variant="h4" className="text-text-primary">Change Email</Text>
            <Text variant="bodySmall" className="text-text-secondary">
              We will send a verification link to your new email address.
            </Text>
          </div>
          <form className="space-y-4" onSubmit={handleEmailSubmit}>
            <Input
              label="Current Password"
              type="password"
              value={currentEmailPassword}
              onChange={(event) => setCurrentEmailPassword(event.target.value)}
              required
            />
            <Input
              label="New Email"
              type="email"
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
              required
            />
            <Button type="submit" disabled={isSubmittingEmail}>
              {isSubmittingEmail ? 'Requesting...' : 'Request Email Change'}
            </Button>
            {/** Inline error for invalid credentials or other failures */}
            {emailError && <Text color="error">{emailError}</Text>}
          </form>
        </div>
      </Card>

      <Card>
        <div className="space-y-4">
          <div>
            <Text variant="h4" className="text-text-primary">Change Password</Text>
            <Text variant="bodySmall" className="text-text-secondary">
              Your new password must meet the security requirements.
            </Text>
          </div>
          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
            <Button type="submit" disabled={isSubmittingPassword}>
              {isSubmittingPassword ? 'Updating...' : 'Update Password'}
            </Button>
            {passwordError && <Text color="error">{passwordError}</Text>}
          </form>
        </div>
      </Card>
    </div>
  );
}
