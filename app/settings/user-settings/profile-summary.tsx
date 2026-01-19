'use client';

import { Card } from '@/components/common/Card/Card';
import { Badge } from '@/components/common/Badge/Badge';
import { Text } from '@/components/common/Text/Text';
import type { ProfileSummary } from '@/lib/api/user-settings';

export type ProfileSummaryProps = {
  profile: ProfileSummary | null;
  isLoading?: boolean;
  errorMessage?: string | null;
};

const formatDateTime = (value?: string) => {
  if (!value) {
    return 'Not available';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }
  return date.toLocaleString();
};

export default function ProfileSummary({ profile, isLoading = false, errorMessage }: ProfileSummaryProps) {
  return (
    <Card>
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Text variant="h4" className="text-text-primary">
            Profile Summary
          </Text>
          <div className="flex flex-wrap gap-2">
            {profile?.pendingEmail && <Badge variant="warning">Email change pending</Badge>}
            {profile?.pendingDeletion && <Badge variant="error">Deletion requested</Badge>}
          </div>
        </div>

        {isLoading && <Text color="secondary">Loading profile details...</Text>}
        {!isLoading && errorMessage && <Text color="error">{errorMessage}</Text>}

        {!isLoading && !errorMessage && profile && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Text variant="label" color="secondary">
                Display Name
              </Text>
              <Text>{profile.displayName}</Text>
            </div>
            <div>
              <Text variant="label" color="secondary">
                Primary Email
              </Text>
              <Text>{profile.primaryEmail}</Text>
            </div>
            <div>
              <Text variant="label" color="secondary">
                Password Updated
              </Text>
              <Text>{formatDateTime(profile.passwordUpdatedAt)}</Text>
            </div>
            <div>
              <Text variant="label" color="secondary">
                Last Profile Activity
              </Text>
              <Text>{formatDateTime(profile.lastAuditEvent)}</Text>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
