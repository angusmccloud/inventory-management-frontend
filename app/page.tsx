/**
 * Landing Page - Inventory HQ
 *
 * Public home page with authentication options
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, refreshAccessToken, clearAuth } from '@/lib/auth';
import { Button } from '@/components/common';
import { Text } from '@/components/common/Text/Text';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { StorageLocationIcon, ShoppingCartIcon, UsersIcon } from '@/components/common/icons';

export default function Home() {
  const router = useRouter();
  const [authState, setAuthState] = useState<'unknown' | 'authenticating' | 'unauthenticated'>(
    'unknown'
  );

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    // Determine auth state synchronously to avoid flashing the homepage.
    const token = getAuthToken();
    if (token) {
      setAuthState('authenticating');

      // Try to refresh/validate the token. On success redirect, on failure clear and show homepage
      (async () => {
        try {
          const ok = await refreshAccessToken();
          if (ok) {
            router.push('/dashboard');
            return;
          }
        } catch (e) {
          // ignore - we'll clear below
        }

        clearAuth();
        setAuthState('unauthenticated');
      })();
      return;
    }

    // No token found — render public homepage
    setAuthState('unauthenticated');
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      {authState === 'unknown' ? (
        // Minimal background while we synchronously check for token
        <div className="min-h-[200px] w-full" />
      ) : authState === 'authenticating' ? (
        <div className="flex w-full flex-1 items-center justify-center">
          <div className="w-full max-w-xl">
            <LoadingSpinner size="lg" center label="Signing you in..." />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl space-y-8">
          {/* Hero Section */}
          <div className="space-y-4 text-center">
            <h1 className="text-5xl font-bold text-text-default">Inventory HQ</h1>
            <Text variant="h4" color="primary" className="mx-auto max-w-2xl">
              Simple home inventory for staple items — shopping, stock, and family coordination
              without the complexity.
            </Text>
          </div>

          {/* Features Grid */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<StorageLocationIcon className="h-10 w-10 text-primary" />}
              title="Track Inventory"
              description="Monitor quantities, set low-stock alerts, and organize items by location"
            />
            <FeatureCard
              icon={<ShoppingCartIcon className="h-10 w-10 text-primary" />}
              title="Shopping Lists"
              description="Create and manage shopping lists organized by store"
            />
            <FeatureCard
              icon={<UsersIcon className="h-10 w-10 text-primary" />}
              title="Family Collaboration"
              description="Share access with family members with role-based permissions"
            />
          </div>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/login')}
              className="sm:w-auto"
            >
              Sign In / Create Account
            </Button>
          </div>

          {/* Key Benefits */}
          <div className="mt-16 rounded-lg bg-surface p-8 shadow-lg">
            <h2 className="mb-6 text-center text-2xl font-bold text-text-default">
              Why Choose Our System?
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <BenefitItem
                title="Save Time"
                description="No more forgotten items or duplicate purchases"
              />
              <BenefitItem
                title="Stay Organized"
                description="Know exactly what you have and where it's stored"
              />
              <BenefitItem
                title="Coordinate Easily"
                description="Real-time updates keep everyone on the same page"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/**
 * Feature card component
 */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3 rounded-lg bg-surface p-6 text-center shadow-md">
      <div className="flex items-center justify-center">{icon}</div>
      <h3 className="text-xl font-semibold text-text-default">{title}</h3>
      <Text variant="body" color="primary">
        {description}
      </Text>
    </div>
  );
}

/**
 * Benefit item component
 */
function BenefitItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h4 className="font-semibold text-text-default">{title}</h4>
        <Text variant="bodySmall" color="primary">
          {description}
        </Text>
      </div>
    </div>
  );
}

/**
 * Simple line-drawing SVG icons used on the homepage.
 * Kept inline to ensure stroke-based (line) style consistent with site icons.
 */
// Icons centralized in components/common/icons
