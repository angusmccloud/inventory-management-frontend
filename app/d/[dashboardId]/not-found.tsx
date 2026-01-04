import Link from 'next/link';
import { Text } from '@/components/common';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <svg
            className="mx-auto mb-4 h-16 w-16 text-gray-400 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard Not Found
          </h1>
          <Text variant="body" color="secondary" className="mb-6">
            The dashboard you're looking for doesn't exist or has been deactivated.
          </Text>
          <div className="space-y-3">
            <Text variant="bodySmall" color="secondary">
              Possible reasons:
            </Text>
            <ul className="space-y-1 text-left text-sm text-gray-600 dark:text-gray-400">
              <li>• The dashboard link is incorrect or expired</li>
              <li>• The dashboard has been deactivated by the owner</li>
              <li>• The dashboard was rotated to a new URL</li>
            </ul>
          </div>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
