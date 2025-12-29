/**
 * NFC Page Not Found
 * 
 * @description 404 page for invalid or inactive NFC URLs
 * Route: /t/[urlId]/not-found
 * 
 * @see specs/006-api-integration/spec.md - User Story 1
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NFC Tag Not Found',
  description: 'Invalid or inactive NFC tag',
};

/**
 * Not Found page for invalid NFC URLs
 * 
 * WCAG 2.1 AA compliant with proper color contrast and focus states
 */
export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-lg shadow-lg p-8 text-center">
          {/* 404 Icon */}
          <div className="mx-auto w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-text-default"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-text-secondary dark:text-white mb-2">
            NFC Tag Not Found
          </h1>

          {/* Message */}
          <p className="text-lg text-text-default mb-6">
            This NFC tag is invalid or has been deactivated
          </p>

          {/* Explanation */}
          <div className="bg-surface-elevated rounded-lg p-6 mb-6 text-left">
            <p className="text-sm text-text-default mb-3">
              <strong className="text-text-secondary dark:text-white">Possible reasons:</strong>
            </p>
            <ul className="space-y-2 text-sm text-text-default">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-text-secondary mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <circle cx="10" cy="10" r="2" />
                </svg>
                <span>The NFC URL has been rotated (replaced with a new one)</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-text-secondary mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <circle cx="10" cy="10" r="2" />
                </svg>
                <span>The inventory item has been deleted</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-text-secondary mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <circle cx="10" cy="10" r="2" />
                </svg>
                <span>The URL ID is incorrect or malformed</span>
              </li>
            </ul>
          </div>

          {/* Action Instructions */}
          <div className="space-y-3">
            <p className="text-sm text-text-default">
              Contact your family administrator to generate a new NFC tag for this item.
            </p>
          </div>

          {/* Support Information */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-text-default">
              NFC tags can be managed from the inventory item details page.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
