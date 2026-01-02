import Link from 'next/link';
import { Text } from '@/components/common';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-lg">
          <svg
            className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4"
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Dashboard Not Found
          </h1>
          <Text variant="body" color="secondary" className="mb-6">
            The dashboard you're looking for doesn't exist or has been deactivated.
          </Text>
          <div className="space-y-3">
            <Text variant="bodySmall" color="secondary">
              Possible reasons:
            </Text>
            <ul className="text-sm text-gray-600 dark:text-gray-400 text-left space-y-1">
              <li>• The dashboard link is incorrect or expired</li>
              <li>• The dashboard has been deactivated by the owner</li>
              <li>• The dashboard was rotated to a new URL</li>
            </ul>
          </div>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
