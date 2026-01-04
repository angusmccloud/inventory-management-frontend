/**
 * NFC Page Not Found
 *
 * @description 404 page for invalid or inactive NFC URLs
 * Route: /t/[urlId]/not-found
 *
 * @see specs/006-api-integration/spec.md - User Story 1
 */

import type { Metadata } from 'next';
import { Text } from '@/components/common/Text/Text';

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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-surface p-8 text-center shadow-lg">
          {/* 404 Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated">
            <svg
              className="h-10 w-10 text-text-default"
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
          <h1 className="mb-2 text-2xl font-bold text-text-secondary dark:text-white">
            NFC Tag Not Found
          </h1>

          {/* Message */}
          <Text variant="h5" color="primary" className="mb-6">
            This NFC tag is invalid or has been deactivated
          </Text>

          {/* Explanation */}
          <div className="mb-6 rounded-lg bg-surface-elevated p-6 text-left">
            <Text variant="bodySmall" color="primary" className="mb-3">
              <strong className="text-text-secondary dark:text-white">Possible reasons:</strong>
            </Text>
            <ul className="space-y-2 text-sm text-text-default">
              <li className="flex items-start">
                <svg
                  className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-text-secondary"
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
                  className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-text-secondary"
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
                  className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-text-secondary"
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
            <Text variant="bodySmall" color="primary">
              Contact your family administrator to generate a new NFC tag for this item.
            </Text>
          </div>

          {/* Support Information */}
          <div className="mt-8 border-t border-border pt-6">
            <Text variant="caption" color="primary">
              NFC tags can be managed from the inventory item details page.
            </Text>
          </div>
        </div>
      </div>
    </main>
  );
}
