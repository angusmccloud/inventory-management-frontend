/**
 * Reference Data Management Page - DEPRECATED
 * 
 * This page has been consolidated into the main Settings page with tabs.
 * Redirect to /settings
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageLoading } from '@/components/common';

export default function ReferenceDataRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Settings page with stores tab active
    router.replace('/settings');
  }, [router]);

  return <PageLoading message="Redirecting to Settings..." />;
}
