/**
 * ThemeProvider Component
 * 
 * Automatically applies dark/light theme based on system preferences.
 * This component adds the 'dark' class to the <html> element when
 * the user's system is in dark mode.
 */

'use client';

import { useEffect } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Function to update theme based on system preference
    const updateTheme = (e: MediaQueryList | MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    // Check initial system preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    updateTheme(darkModeQuery);

    // Listen for changes in system preference
    darkModeQuery.addEventListener('change', updateTheme);

    // Cleanup listener on unmount
    return () => {
      darkModeQuery.removeEventListener('change', updateTheme);
    };
  }, []);

  return <>{children}</>;
}
