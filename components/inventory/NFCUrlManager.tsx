/**
 * NFC URL Manager Component
 * 
 * @description Admin component for managing NFC URLs for inventory items
 * Features:
 * - Display list of active/inactive NFC URLs
 * - Generate new NFC URLs
 * - Copy URLs to clipboard
 * - Rotate (deactivate old, create new) URLs
 * - View access statistics
 * 
 * @see specs/006-api-integration/spec.md - User Story 3
 * @see specs/006-api-integration/contracts/nfc-url-management-api.yaml
 */

'use client';

import { useState, useEffect } from 'react';
import { nfcUrlsApi } from '@/lib/api/nfcUrls';
import type { NFCUrl } from '@/types/entities';

interface NFCUrlManagerProps {
  itemId: string;
  itemName: string;
}

interface NFCUrlManagerState {
  urls: NFCUrl[];
  isLoading: boolean;
  isGenerating: boolean;
  isRotating: string | null; // urlId being rotated
  error: string | null;
  copiedUrlId: string | null; // urlId that was just copied
}

/**
 * Admin component for NFC URL management
 * 
 * Authorization: Admin role required (enforced by API)
 * WCAG 2.1 AA compliant
 */
export default function NFCUrlManager({ itemId, itemName }: NFCUrlManagerProps) {
  const [state, setState] = useState<NFCUrlManagerState>({
    urls: [],
    isLoading: true,
    isGenerating: false,
    isRotating: null,
    error: null,
    copiedUrlId: null,
  });

  const [rotateConfirmUrlId, setRotateConfirmUrlId] = useState<string | null>(null);

  /**
   * Load NFC URLs for item
   */
  useEffect(() => {
    loadUrls();
  }, [itemId]);

  const loadUrls = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await nfcUrlsApi.listForItem(itemId);
      setState((prev) => ({
        ...prev,
        urls: response.urls || [],
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load NFC URLs',
        isLoading: false,
      }));
    }
  };

  /**
   * Generate new NFC URL
   */
  const handleGenerate = async () => {
    setState((prev) => ({ ...prev, isGenerating: true, error: null }));

    try {
      const newUrl = await nfcUrlsApi.create(itemId);
      
      // Add new URL to list
      setState((prev) => ({
        ...prev,
        urls: [newUrl, ...prev.urls],
        isGenerating: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to generate NFC URL',
        isGenerating: false,
      }));
    }
  };

  /**
   * Copy URL to clipboard
   */
  const handleCopy = async (urlId: string) => {
    try {
      const fullUrl = nfcUrlsApi.getFullUrl(urlId);
      await navigator.clipboard.writeText(fullUrl);
      
      setState((prev) => ({ ...prev, copiedUrlId: urlId }));
      
      // Clear copied state after 2 seconds
      setTimeout(() => {
        setState((prev) => ({ ...prev, copiedUrlId: null }));
      }, 2000);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: 'Failed to copy URL to clipboard',
      }));
    }
  };

  /**
   * Rotate NFC URL (deactivate old, create new)
   */
  const handleRotate = async (urlId: string) => {
    setState((prev) => ({ ...prev, isRotating: urlId, error: null }));
    setRotateConfirmUrlId(null);

    try {
      const response = await nfcUrlsApi.rotate(itemId, urlId);
      
      // Replace old URL with new one
      setState((prev) => ({
        ...prev,
        urls: prev.urls.map((url) =>
          url.urlId === urlId
            ? { ...url, isActive: false }
            : url
        ).concat(response.newUrl),
        isRotating: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to rotate NFC URL',
        isRotating: null,
      }));
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (state.isLoading) {
    return (
      <div className="bg-surface rounded-lg shadow p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-text-secondary">Loading NFC URLs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-default">
              NFC URLs
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Manage scannable URLs for {itemName}
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={state.isGenerating}
            className="px-4 py-2 bg-primary hover:bg-primary-hover disabled:bg-surface-elevated text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-primary/30 disabled:cursor-not-allowed"
            aria-label="Generate new NFC URL"
          >
            {state.isGenerating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              '+ Generate NFC URL'
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="mx-6 mt-4 bg-error/10 border border-error/30 rounded-lg p-4" role="alert">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-error mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-error">Error</h4>
              <p className="text-sm text-error mt-1">{state.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* NFC URLs List */}
      <div className="p-6">
        {state.urls.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-text-disabled" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-text-default">No NFC URLs</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Generate your first NFC URL to enable tap-to-adjust functionality
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {state.urls.map((url) => (
              <div
                key={url.urlId}
                className={`border rounded-lg p-4 ${
                  url.isActive
                    ? 'border-secondary/30 bg-secondary/10'
                    : 'border-border bg-surface-elevated'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Status Badge */}
                    <div className="flex items-center mb-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          url.isActive
                            ? 'bg-secondary/20 text-secondary-contrast'
                            : 'bg-surface-elevated text-text-default'
                        }`}
                      >
                        {url.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {url.accessCount > 0 && (
                        <span className="ml-2 text-xs text-text-secondary">
                          {url.accessCount} {url.accessCount === 1 ? 'access' : 'accesses'}
                        </span>
                      )}
                    </div>

                    {/* URL Display */}
                    <div className="flex items-center mb-2">
                      <code className="text-sm font-mono text-text-default bg-surface px-3 py-1 rounded border border-border truncate">
                        {nfcUrlsApi.getFullUrl(url.urlId)}
                      </code>
                    </div>

                    {/* Metadata */}
                    <div className="text-xs text-text-secondary space-y-1">
                      <p>Created: {formatDate(url.createdAt)}</p>
                      {url.lastAccessedAt && (
                        <p>Last accessed: {formatDate(url.lastAccessedAt)}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ml-4 flex flex-col gap-2">
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(url.urlId)}
                      className="px-3 py-1 text-sm bg-surface-elevated hover:bg-surface text-text-default rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Copy URL to clipboard"
                    >
                      {state.copiedUrlId === url.urlId ? (
                        <span className="flex items-center text-secondary-contrast">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </span>
                      )}
                    </button>

                    {/* Rotate Button */}
                    {url.isActive && (
                      <button
                        onClick={() => setRotateConfirmUrlId(url.urlId)}
                        disabled={state.isRotating === url.urlId}
                        className="px-3 py-1 text-sm bg-tertiary/20 hover:bg-tertiary/30 text-tertiary-contrast rounded transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Rotate URL (deactivate and create new)"
                      >
                        {state.isRotating === url.urlId ? (
                          <span className="flex items-center">
                            <svg className="animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Rotating...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Rotate
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rotate Confirmation Dialog */}
      {rotateConfirmUrlId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="rotate-dialog-title">
          <div className="bg-surface rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 id="rotate-dialog-title" className="text-lg font-semibold text-text-default mb-2">
              Rotate NFC URL?
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              This will deactivate the current URL and generate a new one. The old URL will stop working immediately. You'll need to update any physical NFC tags with the new URL.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setRotateConfirmUrlId(null)}
                className="px-4 py-2 text-sm bg-surface-elevated hover:bg-surface text-text-default rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRotate(rotateConfirmUrlId)}
                className="px-4 py-2 text-sm bg-tertiary hover:bg-tertiary-hover text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-tertiary"
              >
                Rotate URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
