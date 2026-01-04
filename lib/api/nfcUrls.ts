/**
 * NFC URL API Client
 *
 * @description Client-side API for NFC URL management operations.
 * Provides methods for generating, listing, and rotating NFC URLs.
 *
 * @see specs/006-api-integration/contracts/nfc-url-management-api.yaml
 */

import { apiClient } from '../api-client';
import {
  NFCUrl,
  NfcUrlListResponse,
  NfcAdjustmentRequest,
  NfcAdjustmentResponse,
} from '@/types/entities';

/**
 * NFC URL Management API
 *
 * All operations require authentication and admin role
 */
export const nfcUrlsApi = {
  /**
   * List all NFC URLs for an inventory item
   *
   * GET /api/items/{itemId}/nfc-urls
   *
   * @param itemId - Inventory item UUID
   * @returns List of NFC URLs for the item
   */
  async listForItem(itemId: string): Promise<NfcUrlListResponse> {
    return apiClient.get<NfcUrlListResponse>(`/api/items/${itemId}/nfc-urls`);
  },

  /**
   * Create a new NFC URL for an inventory item
   *
   * POST /api/items/{itemId}/nfc-urls
   *
   * @param itemId - Inventory item UUID
   * @returns Newly created NFCUrl entity
   */
  async create(itemId: string): Promise<NFCUrl> {
    return apiClient.post<NFCUrl>(`/api/items/${itemId}/nfc-urls`, {});
  },

  /**
   * Rotate an NFC URL (deactivate old, create new)
   *
   * POST /api/items/{itemId}/nfc-urls/{urlId}/rotate
   *
   * @param itemId - Inventory item UUID
   * @param urlId - URL ID to rotate
   * @returns Response with old and new URL IDs
   */
  async rotate(
    itemId: string,
    urlId: string
  ): Promise<{
    message: string;
    oldUrlId: string;
    newUrl: NFCUrl;
  }> {
    return apiClient.post<{
      message: string;
      oldUrlId: string;
      newUrl: NFCUrl;
    }>(`/api/items/${itemId}/nfc-urls/${urlId}/rotate`, {});
  },

  /**
   * Deactivate an existing NFC URL without generating a replacement
   *
   * DELETE /api/items/{itemId}/nfc-urls/{urlId}
   *
   * @param itemId - Inventory item UUID
   * @param urlId - URL ID to deactivate
   */
  async deactivate(itemId: string, urlId: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/api/items/${itemId}/nfc-urls/${urlId}`);
  },

  /**
   * List all NFC URLs for the family
   *
   * GET /api/nfc-urls
   *
   * @returns List of all NFC URLs for the authenticated user's family
   */
  async listForFamily(): Promise<NfcUrlListResponse> {
    return apiClient.get<NfcUrlListResponse>('/api/nfc-urls');
  },

  /**
   * Adjust inventory via NFC URL (unauthenticated)
   *
   * POST /api/adjust/{urlId}
   *
   * @param urlId - URL ID from NFC tag
   * @param delta - Adjustment delta (-1 or +1)
   * @returns Adjustment response with new quantity
   */
  async adjust(urlId: string, delta: -1 | 1): Promise<NfcAdjustmentResponse> {
    const request: NfcAdjustmentRequest = { delta };

    // Use fetch directly since this endpoint doesn't require authentication
    const response = await fetch(`${process.env['NEXT_PUBLIC_API_URL']}/api/adjust/${urlId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Adjustment failed');
    }

    return response.json();
  },

  /**
   * Get full NFC URL for display
   *
   * Constructs the complete URL that should be programmed into NFC tags.
   *
   * @param urlId - URL ID
   * @returns Full URL string (e.g., "https://inventoryhq.io/t/2gSZw8...")
   */
  getFullUrl(urlId: string): string {
    const baseUrl = process.env['NEXT_PUBLIC_FRONTEND_URL'] || 'http://localhost:3000';
    return `${baseUrl}/t/${urlId}`;
  },
};
