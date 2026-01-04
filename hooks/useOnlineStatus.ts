/**
 * useOnlineStatus Hook
 *
 * @description Custom React hook to detect online/offline status
 * Uses browser navigator.onLine API and listens to online/offline events
 *
 * @returns {boolean} isOnline - Current online status
 *
 * @example
 * ```tsx
 * const isOnline = useOnlineStatus();
 *
 * return (
 *   <button disabled={!isOnline}>
 *     {isOnline ? 'Save' : 'Offline'}
 *   </button>
 * );
 * ```
 */

'use client';

import { useState, useEffect } from 'react';

export function useOnlineStatus(): boolean {
  // Initialize with navigator.onLine if available (SSR-safe)
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof window !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    // Skip if not in browser environment
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
