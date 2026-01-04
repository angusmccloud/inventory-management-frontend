/**
 * Theme type definitions
 * Feature: 012-theme-toggle
 */

/** User's theme preference */
export type ThemeMode = 'light' | 'dark' | 'auto';

/** Actually applied theme (resolved from mode + system preference) */
export type AppliedTheme = 'light' | 'dark';

/** Theme context value */
export interface ThemeContextValue {
  /** User's selected theme mode */
  mode: ThemeMode;

  /** Currently applied theme */
  applied: AppliedTheme;

  /** Update theme mode */
  setMode: (mode: ThemeMode) => void | Promise<void>;
}

/** Theme preference API response */
export interface ThemePreferenceResponse {
  data: {
    theme: ThemeMode;
  };
}

/** Theme preference API request */
export interface ThemePreferenceRequest {
  theme: ThemeMode;
}
