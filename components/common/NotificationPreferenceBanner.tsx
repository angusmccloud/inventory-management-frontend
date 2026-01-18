'use client';

import * as React from 'react';
import { Text } from './Text/Text';

export interface NotificationPreferenceBannerProps {
  unsubscribeAllEmail: boolean;
}

export const NotificationPreferenceBanner: React.FC<NotificationPreferenceBannerProps> = ({
  unsubscribeAllEmail,
}) => {
  if (!unsubscribeAllEmail) return null;

  return (
    <div className="mb-4 rounded-md bg-yellow-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Text variant="body" className="font-medium text-yellow-900">
            You're unsubscribed from all emails
          </Text>
          <Text variant="bodySmall" className="mt-1 text-yellow-800">
            You will not receive any email notifications. You can change this in your notification
            preferences.
          </Text>
        </div>

        {/* Button removed: toggle exists inline on settings page */}
      </div>
    </div>
  );
};

export default NotificationPreferenceBanner;
