/**
 * NFC Page Error Boundary
 *
 * @description Error page for invalid or inactive NFC URLs
 * Route: /t/[urlId]/error
 *
 * @see specs/006-api-integration/spec.md - User Story 1
 */

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/common/Button/Button';
import { Text } from '@/components/common/Text/Text';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for NFC adjustment page
 *
 * WCAG 2.1 AA compliant with proper color contrast
 */
export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error for monitoring
    console.error('NFC page error:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-surface p-8 text-center shadow-lg">
          {/* Error Icon */}
          <div className="bg-tertiary/10/30 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              className="h-10 w-10 text-tertiary-contrast"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Error Title */}
          <h1 className="mb-2 text-2xl font-bold text-text-secondary dark:text-white">
            Something Went Wrong
          </h1>

          {/* Error Message */}
          <Text variant="h5" color="primary" className="mb-6">
            Unable to process this NFC tag
          </Text>

          {/* Error Details (in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 rounded-lg bg-surface-elevated p-4 text-left">
              <Text variant="caption" color="primary" className="break-all font-mono">
                {error.message}
              </Text>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Try Again Button */}
            <Button variant="primary" size="md" fullWidth onClick={reset}>
              Try Again
            </Button>

            {/* Help Text */}
            <Text variant="bodySmall" color="primary">
              If this problem persists, the NFC tag may be inactive or invalid.
            </Text>
          </div>

          {/* Support Information */}
          <div className="mt-8 border-t border-border pt-6">
            <Text variant="caption" color="primary">
              Need help? Contact your family administrator to verify the NFC tag configuration.
            </Text>
          </div>
        </div>
      </div>
    </main>
  );
}
