/**
 * Theme Preference API Client
 * 
 * Handles API calls for user theme preferences.
 */

import { ThemeMode } from '@/types/theme';

const API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3001';

/**
 * Get the authenticated user's theme preference
 */
export async function getThemePreference(userId: string, token: string): Promise<ThemeMode> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/preferences/theme`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get theme preference: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data.theme as ThemeMode;
}

/**
 * Update the authenticated user's theme preference
 */
export async function updateThemePreference(
  userId: string,
  token: string,
  theme: ThemeMode
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/preferences/theme`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ theme }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update theme preference: ${response.statusText}`);
  }
}
