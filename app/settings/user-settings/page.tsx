'use client';

import { UserSettingsProvider } from './useUserSettings';
import UserSettingsPanel from './user-settings-panel';

export default function UserSettingsPage() {
  return (
    <UserSettingsProvider>
      <UserSettingsPanel />
    </UserSettingsProvider>
  );
}
