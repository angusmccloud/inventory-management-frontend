/**
 * Suggestion API Client
 * Handles all suggestion-related API calls
 */

import { apiClient } from '../api-client';
import { Suggestion, SuggestionStatus } from '../../types/entities';

/**
 * Request types for suggestion creation
 */
export type CreateSuggestionRequest =
  | {
      type: 'add_to_shopping';
      itemId: string;
      notes?: string | null;
    }
  | {
      type: 'create_item';
      proposedItemName: string;
      proposedQuantity: number;
      proposedThreshold: number;
      notes?: string | null;
    };

/**
 * Request type for suggestion rejection
 */
export interface RejectSuggestionRequest {
  rejectionNotes?: string | null;
}

/**
 * Response type for listing suggestions
 */
export interface ListSuggestionsResponse {
  suggestions: Suggestion[];
  nextToken?: string;
}

/**
 * Query parameters for listing suggestions
 */
export interface ListSuggestionsParams {
  status?: SuggestionStatus;
  limit?: number;
  nextToken?: string;
}

/**
 * Create a new suggestion
 */
export const createSuggestion = async (
  familyId: string,
  data: CreateSuggestionRequest
): Promise<Suggestion> => {
  return apiClient.post<Suggestion>(`/families/${familyId}/suggestions`, data, true);
};

/**
 * List suggestions for a family
 */
export const listSuggestions = async (
  familyId: string,
  params?: ListSuggestionsParams
): Promise<ListSuggestionsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.status) {
    queryParams.append('status', params.status);
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params?.nextToken) {
    queryParams.append('nextToken', params.nextToken);
  }

  const queryString = queryParams.toString();
  const url = `/families/${familyId}/suggestions${queryString ? `?${queryString}` : ''}`;
  
  return apiClient.get<ListSuggestionsResponse>(url, true);
};

/**
 * Get a single suggestion
 */
export const getSuggestion = async (
  familyId: string,
  suggestionId: string
): Promise<Suggestion> => {
  return apiClient.get<Suggestion>(
    `/families/${familyId}/suggestions/${suggestionId}`,
    true
  );
};

/**
 * Approve a suggestion (admin only)
 */
export const approveSuggestion = async (
  familyId: string,
  suggestionId: string
): Promise<Suggestion> => {
  return apiClient.post<Suggestion>(
    `/families/${familyId}/suggestions/${suggestionId}/approve`,
    {},
    true
  );
};

/**
 * Reject a suggestion (admin only)
 */
export const rejectSuggestion = async (
  familyId: string,
  suggestionId: string,
  data?: RejectSuggestionRequest
): Promise<Suggestion> => {
  return apiClient.post<Suggestion>(
    `/families/${familyId}/suggestions/${suggestionId}/reject`,
    data || {},
    true
  );
};
