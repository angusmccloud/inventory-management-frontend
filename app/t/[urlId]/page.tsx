/**
 * NFC Adjustment Page
 * 
 * @description Server-side rendered page for NFC-triggered inventory adjustments.
 * Route: /t/[urlId]
 * 
 * User Story: User taps NFC tag → browser opens page → quantity auto-adjusts → feedback displayed
 * 
 * @see specs/006-api-integration/spec.md - User Story 1
 * @see specs/006-api-integration/contracts/nfc-adjustment-api.yaml
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SuccessDisplay from './SuccessDisplay';

interface NfcPageProps {
  params: Promise<{
    urlId: string;
  }>;
}

interface AdjustmentResponse {
  success: boolean;
  newQuantity: number;
  itemName: string;
  message: string;
  delta?: number;
  error?: string;
  code?: string;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Inventory Adjustment',
    description: 'Quick inventory adjustment via NFC tap',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  };
}

/**
 * Perform server-side inventory adjustment
 */
async function performAdjustment(urlId: string): Promise<AdjustmentResponse> {
  const apiBaseUrl = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3001';
  const adjustmentUrl = `${apiBaseUrl}/api/adjust/${urlId}`;

  console.log('[NFC] Performing adjustment:', { urlId, apiBaseUrl, adjustmentUrl });

  try {
    const response = await fetch(adjustmentUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ delta: -1 }),
      cache: 'no-store', // Never cache adjustment requests
    });

    console.log('[NFC] Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('[NFC] Error response:', errorData);
      
      if (response.status === 404) {
        return {
          success: false,
          newQuantity: 0,
          itemName: '',
          message: 'Invalid or inactive NFC tag',
          error: errorData.error || 'NOT_FOUND',
          code: 'NOT_FOUND',
        };
      }

      return {
        success: false,
        newQuantity: 0,
        itemName: '',
        message: 'Adjustment failed',
        error: errorData.error || 'ADJUSTMENT_FAILED',
        code: errorData.code || 'UNKNOWN_ERROR',
      };
    }

    const data = await response.json();
    console.log('[NFC] Success response:', data);
    return {
      success: true,
      newQuantity: data.newQuantity,
      itemName: data.itemName,
      message: data.message || `${data.itemName} quantity updated to ${data.newQuantity}`,
      delta: data.delta || -1,
    };
  } catch (error) {
    console.error('NFC adjustment error:', error);
    return {
      success: false,
      newQuantity: 0,
      itemName: '',
      message: 'Network error - please try again',
      error: 'NETWORK_ERROR',
      code: 'NETWORK_ERROR',
    };
  }
}

/**
 * NFC Adjustment Page Component (Server Component)
 * 
 * Automatically applies -1 adjustment on page load
 * Mobile-responsive design with WCAG 2.1 AA compliance
 */
export default async function NfcPage({ params }: NfcPageProps) {
  const { urlId } = await params;

  // Validate URL ID format (basic check)
  if (!urlId || urlId.length !== 22 || !/^[a-zA-Z0-9]+$/.test(urlId)) {
    notFound();
  }

  // Perform adjustment on server-side
  const result = await performAdjustment(urlId);

  // If NOT_FOUND, trigger 404 page
  if (!result.success && result.code === 'NOT_FOUND') {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success State */}
        {result.success && (
          <SuccessDisplay
            itemName={result.itemName}
            initialQuantity={result.newQuantity}
            previousQuantity={result.newQuantity - (result.delta || -1)}
            urlId={urlId}
            apiBaseUrl={process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3001'}
          />
        )}

        {/* Error State */}
        {!result.success && result.code !== 'NOT_FOUND' && (
          <div className="bg-surface rounded-lg shadow-lg p-8 text-center">
            {/* Error Icon */}
            <div className="mx-auto w-16 h-16 bg-error/10/30 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-error"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-text-secondary dark:text-white mb-2">
              Adjustment Failed
            </h1>

            {/* Error Message */}
            <p className="text-lg text-text-default mb-6">
              {result.message}
            </p>

            {/* Error Code (for debugging) */}
            {result.code && (
              <p className="text-sm text-text-default">
                Error code: {result.code}
              </p>
            )}

            {/* Retry Instructions */}
            <div className="mt-8 p-4 bg-surface-elevated rounded-lg">
              <p className="text-sm text-text-default">
                Try tapping the NFC tag again or contact support if the problem persists.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
