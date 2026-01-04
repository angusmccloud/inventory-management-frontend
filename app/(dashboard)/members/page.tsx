/**
 * Members Page - Redirect to Settings
 * Feature: 003-member-management
 *
 * This page redirects to the Settings page where member management is now located
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageLoading } from '@/components/common';

export default function MembersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to settings with members tab active
    router.replace('/settings?tab=members');
  }, [router]);

  return <PageLoading message="Redirecting to Settings..." fullHeight={false} />;
}
