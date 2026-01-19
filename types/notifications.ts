export type NotificationChannel = 'EMAIL' | 'IN_APP';
export type NotificationTypeKey = 'LOW_STOCK' | 'SUGGESTION';
export type NotificationFrequency = 'NONE' | 'IMMEDIATE' | 'DAILY' | 'WEEKLY';
export type NotificationFrequencyValue = NotificationFrequency | NotificationFrequency[];

export type PreferenceEntry = {
  channel: NotificationChannel;
  frequency: NotificationFrequencyValue;
};

export type NotificationPreference = {
  notificationType: NotificationTypeKey;
  entries: PreferenceEntry[];
};

export interface NotificationPreferences {
  preferences: NotificationPreference[];
  defaultFrequency: NotificationFrequency;
  unsubscribeAllEmail: boolean;
  timezone?: string;
  lastUpdatedAt?: string;
}

export interface NotificationPreferencesResponse {
  data: NotificationPreferences;
}
