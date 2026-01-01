/**
 * ThemeProvider Component
 * Feature: 012-theme-toggle
 * 
 * Provides theme context with three modes: light, dark, and auto (system preference).
 * Automatically detects OS theme preference and allows manual override.
 * Persists user preference in localStorage.
 */

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { ThemeMode, AppliedTheme, ThemeContextValue } from '@/types/theme';
import { ThemeStorage } from '@/lib/theme-storage';
import { getThemePreference, updateThemePreference } from '@/lib/api/theme';
import { isAuthenticated, getUserContext, getAuthToken } from '@/lib/auth';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Initialize theme from localStorage synchronously to prevent flash
const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'auto';
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark' || stored === 'auto') {
      return stored;
    }
  } catch (e) {
    // localStorage not available
  }
  return 'auto';
};

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(getInitialTheme());
  const [applied, setApplied] = useState<AppliedTheme>('light');
  const [synced, setSynced] = useState<boolean>(false);

  // Initialize from backend (if logged in) or localStorage
  useEffect(() => {
    const initializeTheme = async () => {
      if (isAuthenticated()) {
        try {
          const userContext = getUserContext();
          const token = getAuthToken();
          if (userContext?.memberId && token) {
            // Fetch from backend
            const serverTheme = await getThemePreference(userContext.memberId, token);
            console.log('[ThemeProvider] Loaded theme from server:', serverTheme);
            
            // Only update if different from current (localStorage cache)
            if (serverTheme !== mode) {
              console.log('[ThemeProvider] Server theme differs from cache, updating from', mode, 'to', serverTheme);
              setModeState(serverTheme);
              ThemeStorage.set(serverTheme); // Update cache
              
              // Force apply the new theme
              const html = document.documentElement;
              if (serverTheme === 'light') {
                html.classList.remove('dark');
                console.log('[ThemeProvider] Updated to light theme from server');
              } else if (serverTheme === 'dark') {
                html.classList.add('dark');
                console.log('[ThemeProvider] Updated to dark theme from server');
              }
            } else {
              console.log('[ThemeProvider] Server theme matches cache:', serverTheme);
            }
            
            setSynced(true);
            return;
          }
        } catch (error) {
          console.error('Failed to load theme from server, using cached theme:', error);
        }
      }
      
      // If not authenticated or API failed, we're already using cached theme from initial state
      setSynced(true);
    };

    initializeTheme();
  }, []);

  // Apply theme based on mode
  useEffect(() => {
    console.log('[ThemeProvider] Applying theme mode:', mode);
    
    // Force remove/add classes to ensure state is correct
    const html = document.documentElement;
    
    if (mode === 'light') {
      html.classList.remove('dark');
      setApplied('light');
      console.log('[ThemeProvider] Applied light theme, dark class removed:', !html.classList.contains('dark'));
    } else if (mode === 'dark') {
      html.classList.add('dark');
      setApplied('dark');
      console.log('[ThemeProvider] Applied dark theme, dark class added:', html.classList.contains('dark'));
    } else {
      // Auto mode: follow system preference
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const updateTheme = (e: MediaQueryList | MediaQueryListEvent) => {
        if (e.matches) {
          document.documentElement.classList.add('dark');
          setApplied('dark');
        } else {
          document.documentElement.classList.remove('dark');
          setApplied('light');
        }
      };

      // Apply initial theme
      updateTheme(darkModeQuery);

      // Listen for changes
      darkModeQuery.addEventListener('change', updateTheme);
      return () => darkModeQuery.removeEventListener('change', updateTheme);
    }
  }, [mode]);

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    ThemeStorage.set(newMode);

    // Sync to backend if authenticated
    if (synced && isAuthenticated()) {
      try {
        const userContext = getUserContext();
        const token = getAuthToken();
        if (userContext?.memberId && token) {
          await updateThemePreference(userContext.memberId, token, newMode);
        }
      } catch (error) {
        console.error('Failed to sync theme preference to server:', error);
        // Continue anyway - localStorage is the source of truth for UI
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, applied, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
