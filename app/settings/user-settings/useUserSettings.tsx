'use client';

import * as React from 'react';
import userSettingsApi, { ProfileSummary } from '@/lib/api/user-settings';
import { getUserContext, setUserContext } from '@/lib/auth';

type UserSettingsContextValue = {
  profile: ProfileSummary | null;
  isLoading: boolean;
  isUpdatingName: boolean;
  errorMessage: string | null;
  refreshProfile: () => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
};

const UserSettingsContext = React.createContext<UserSettingsContextValue | null>(null);

export const UserSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = React.useState<ProfileSummary | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUpdatingName, setIsUpdatingName] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const refreshProfile = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const summary = await userSettingsApi.getProfileSummary();
      setProfile(summary);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load profile.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateDisplayName = React.useCallback(
    async (displayName: string) => {
      if (!profile) {
        setErrorMessage('Profile not loaded.');
        return;
      }

      setIsUpdatingName(true);
      setErrorMessage(null);
      const previous = profile;
      setProfile({ ...profile, displayName });

      try {
        const updated = await userSettingsApi.updateDisplayName(displayName);
        setProfile(updated);
        // Update global user context so the app header updates immediately
        try {
          const existing = getUserContext();
          if (existing) {
            setUserContext({ ...existing, name: updated.displayName });
          }
        } catch (e) {
          // swallow - best effort update
          console.error('Failed to update global user context', e);
        }
      } catch (error) {
        setProfile(previous);
        setErrorMessage(error instanceof Error ? error.message : 'Unable to update display name.');
        throw error;
      } finally {
        setIsUpdatingName(false);
      }
    },
    [profile]
  );

  React.useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const value: UserSettingsContextValue = {
    profile,
    isLoading,
    isUpdatingName,
    errorMessage,
    refreshProfile,
    updateDisplayName,
  };

  return <UserSettingsContext.Provider value={value}>{children}</UserSettingsContext.Provider>;
};

export const useUserSettings = (): UserSettingsContextValue => {
  const context = React.useContext(UserSettingsContext);
  if (!context) {
    throw new Error('useUserSettings must be used within UserSettingsProvider');
  }
  return context;
};
