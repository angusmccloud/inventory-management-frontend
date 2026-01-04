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
import { Button } from '@/components/common/Button/Button';
import { Text } from '@/components/common/Text/Text';
import { Alert } from '@/components/common/Alert/Alert';
import Dialog from '@/components/common/Dialog';

interface NFCUrlManagerProps {
  itemId: string;
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
export default function NFCUrlManager({ itemId }: NFCUrlManagerProps) {
  const [state, setState] = useState<NFCUrlManagerState>({
    urls: [],
    isLoading: true,
    isGenerating: false,
    isRotating: null,
    error: null,
    copiedUrlId: null,
  });

  const [rotateConfirmUrlId, setRotateConfirmUrlId] = useState<string | null>(null);
  const [deactivateConfirmUrlId, setDeactivateConfirmUrlId] = useState<string | null>(null);
  const [deactivatingUrlId, setDeactivatingUrlId] = useState<string | null>(null);

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
        error: error instanceof Error ? error.message : 'Failed to load item link',
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
        error: error instanceof Error ? error.message : 'Failed to generate item link',
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
        error: 'Failed to copy link to clipboard',
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
        urls: prev.urls
          .map((url) => (url.urlId === urlId ? { ...url, isActive: false } : url))
          .concat(response.newUrl),
        isRotating: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update item link',
        isRotating: null,
      }));
    }
  };

  /**
   * Deactivate an existing item link without generating a replacement
   */
  const handleDeactivate = async (urlId: string) => {
    setState((prev) => ({ ...prev, error: null }));
    setDeactivatingUrlId(urlId);
    setDeactivateConfirmUrlId(null);

    try {
      await nfcUrlsApi.deactivate(itemId, urlId);
      setState((prev) => ({
        ...prev,
        urls: prev.urls.map((url) => (url.urlId === urlId ? { ...url, isActive: false } : url)),
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to deactivate item link',
      }));
    } finally {
      setDeactivatingUrlId(null);
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

  const hasActiveLink = state.urls.some((url) => url.isActive);

  if (state.isLoading) {
    return (
      <div className="rounded-lg bg-surface p-6 shadow">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <span className="ml-3 text-text-secondary">Loading item link...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {state.error && (
        <Alert severity="error" title="Something went wrong">
          {state.error}
        </Alert>
      )}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Text variant="body">
            Create and manage a unique URL link for this item for use with an NFC or other
            automation shortcuts.
          </Text>
          <Text variant="bodySmall" color="secondary">
            {hasActiveLink
              ? 'Share this link with your household or automations. Update or deactivate it at any time.'
              : 'Generate a new link when you are ready to share access to this item.'}
          </Text>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleGenerate}
          disabled={state.isGenerating || hasActiveLink}
          loading={state.isGenerating}
          title={
            hasActiveLink
              ? 'Deactivate or update the existing link before generating a new one'
              : undefined
          }
        >
          {state.isGenerating ? 'Generating...' : 'Generate Link'}
        </Button>
      </div>

      {state.urls.length === 0 ? (
        <div className="py-4 text-center">
          <svg
            className="mx-auto h-12 w-12 text-text-disabled"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-text-default">No item link yet</h3>
          <Text variant="bodySmall" color="secondary" className="mt-1">
            Generate your first item link to enable tap-to-adjust or automation functionality.
          </Text>
        </div>
      ) : (
        <div className="space-y-6">
          {state.urls
            .slice()
            .sort((a, b) => {
              if (a.isActive && !b.isActive) return -1;
              if (!a.isActive && b.isActive) return 1;
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .map((url) => (
              <div key={url.urlId} className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          url.isActive
                            ? 'bg-secondary text-secondary-contrast'
                            : 'bg-border text-text-secondary'
                        }`}
                      >
                        {url.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {url.accessCount > 0 && (
                        <span className="text-xs text-text-secondary">
                          {url.accessCount} {url.accessCount === 1 ? 'access' : 'accesses'}
                        </span>
                      )}
                    </div>

                    <code className="block truncate rounded-lg border border-border bg-surface-elevated px-3 py-2 font-mono text-sm text-text-default">
                      {nfcUrlsApi.getFullUrl(url.urlId)}
                    </code>

                    <div className="space-y-1 text-xs text-text-secondary">
                      <Text variant="caption" color="secondary">
                        Created: {formatDate(url.createdAt)}
                      </Text>
                      {url.lastAccessedAt && (
                        <Text variant="caption" color="secondary">
                          Last accessed: {formatDate(url.lastAccessedAt)}
                        </Text>
                      )}
                    </div>
                  </div>
                  {url.isActive && (
                    <div className="flex flex-col gap-2 md:w-56">
                      <Button variant="secondary" size="sm" onClick={() => handleCopy(url.urlId)}>
                        {state.copiedUrlId === url.urlId ? 'Link Copied!' : 'Copy Link'}
                      </Button>

                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setRotateConfirmUrlId(url.urlId)}
                          disabled={state.isRotating === url.urlId}
                          loading={state.isRotating === url.urlId}
                        >
                          {state.isRotating === url.urlId ? 'Updating...' : 'Update URL'}
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => setDeactivateConfirmUrlId(url.urlId)}
                          disabled={deactivatingUrlId === url.urlId}
                          loading={deactivatingUrlId === url.urlId}
                        >
                          {deactivatingUrlId === url.urlId ? 'Deactivating...' : 'Deactivate'}
                        </Button>
                      </>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
      {/* Update Link Confirmation Dialog */}
      {rotateConfirmUrlId && (
        <Dialog
          isOpen={true}
          type="primary"
          title="Update Item Link"
          message="Updating this item link will deactivate the current URL and generate a new one. The previous link stops working immediately, so update any NFC tags or automations with the new link right after this change."
          confirmLabel="Update URL"
          cancelLabel="Cancel"
          onConfirm={() => handleRotate(rotateConfirmUrlId)}
          onCancel={() => setRotateConfirmUrlId(null)}
        />
      )}

      {/* Deactivate Link Confirmation Dialog */}
      {deactivateConfirmUrlId && (
        <Dialog
          isOpen={true}
          type="warning"
          title="Deactivate Item Link"
          message="Deactivating this link immediately disables it. Anyone who has the current URL will no longer be able to adjust this item until you generate a new link."
          confirmLabel="Deactivate"
          cancelLabel="Cancel"
          onConfirm={() => handleDeactivate(deactivateConfirmUrlId)}
          onCancel={() => setDeactivateConfirmUrlId(null)}
        />
      )}
    </div>
  );
}
