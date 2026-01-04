/**
 * Theme localStorage management utilities
 * Feature: 012-theme-toggle
 */

import type { ThemeMode } from '@/types/theme';

const THEME_KEY = 'theme';

/**
 * Validates if a value is a valid ThemeMode
 */
function isValidTheme(value: unknown): value is ThemeMode {
  return typeof value === 'string' && ['light', 'dark', 'auto'].includes(value);
}

/**
 * Theme storage utilities for localStorage
 */
export const ThemeStorage = {
  /**
   * Get theme preference from localStorage
   * @returns ThemeMode if found and valid, null otherwise
   */
  get(): ThemeMode | null {
    if (typeof window === 'undefined') return null;

    try {
      const value = localStorage.getItem(THEME_KEY);
      return isValidTheme(value) ? value : null;
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
      return null;
    }
  },

  /**
   * Set theme preference in localStorage
   * @param theme - The theme mode to store
   */
  set(theme: ThemeMode): void {
    if (typeof window === 'undefined') return;

    if (!isValidTheme(theme)) {
      throw new Error(`Invalid theme value: ${theme}`);
    }

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error('Error writing theme to localStorage:', error);
    }
  },

  /**
   * Remove theme preference from localStorage
   */
  remove(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(THEME_KEY);
    } catch (error) {
      console.error('Error removing theme from localStorage:', error);
    }
  },
};
