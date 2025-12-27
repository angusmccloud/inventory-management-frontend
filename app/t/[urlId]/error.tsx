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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-yellow-600 dark:text-yellow-400"
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Something Went Wrong
          </h1>

          {/* Error Message */}
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Unable to process this NFC tag
          </p>

          {/* Error Details (in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-left">
              <p className="text-xs font-mono text-gray-600 dark:text-gray-300 break-all">
                {error.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Try Again Button */}
            <button
              onClick={reset}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 text-white font-medium rounded-lg transition-colors focus:outline-none"
              aria-label="Try again"
            >
              Try Again
            </button>

            {/* Help Text */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If this problem persists, the NFC tag may be inactive or invalid.
            </p>
          </div>

          {/* Support Information */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Need help? Contact your family administrator to verify the NFC tag configuration.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
