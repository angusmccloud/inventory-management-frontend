/**
 * Theme Preference API Client
 *
 * Handles API calls for user theme preferences.
 */

import { ThemeMode } from '@/types/theme';
import { apiClient } from '../api-client';

/**
 * Get the authenticated user's theme preference
 */
export async function getThemePreference(userId: string): Promise<ThemeMode> {
  const data = await apiClient.get<{ theme: ThemeMode }>(
    `/users/${userId}/preferences/theme`,
    true
  );
  return data.theme;
}

/**
 * Update the authenticated user's theme preference
 */
export async function updateThemePreference(userId: string, theme: ThemeMode): Promise<void> {
  await apiClient.put<void>(`/users/${userId}/preferences/theme`, { theme }, true);
}
