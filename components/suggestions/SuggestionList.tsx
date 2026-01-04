'use client';

import { useState, useEffect } from 'react';
import { SuggestionCard } from './SuggestionCard';
import { Button, Text } from '@/components/common';
import { Suggestion } from '@/types/entities';
import { listSuggestions, approveSuggestion, rejectSuggestion } from '@/lib/api/suggestions';

interface SuggestionListProps {
  familyId: string;
  isAdmin: boolean;
  statusFilter?: 'pending' | 'approved' | 'rejected';
  onSuggestionUpdate?: () => void;
}

export function SuggestionList({
  familyId,
  isAdmin,
  statusFilter,
  onSuggestionUpdate,
}: SuggestionListProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);

  const loadSuggestions = async (reset: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await listSuggestions(familyId, {
        status: statusFilter,
        limit: 20,
        nextToken: reset ? undefined : nextToken,
      });

      if (reset) {
        setSuggestions(response.suggestions);
      } else {
        setSuggestions((prev) => [...prev, ...response.suggestions]);
      }

      setNextToken(response.nextToken);
      setHasMore(!!response.nextToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions(true);
  }, [familyId, statusFilter]);

  const handleApprove = async (suggestionId: string) => {
    try {
      await approveSuggestion(familyId, suggestionId);
      await loadSuggestions(true);
      onSuggestionUpdate?.();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('409')) {
          setError('Suggestion was modified by another user. Please refresh.');
        } else if (err.message.includes('422')) {
          setError('Cannot approve: Referenced item has been deleted.');
        } else {
          setError(err.message);
        }
      }
    }
  };

  const handleReject = async (suggestionId: string, rejectionNotes?: string) => {
    try {
      await rejectSuggestion(
        familyId,
        suggestionId,
        rejectionNotes ? { rejectionNotes } : undefined
      );
      await loadSuggestions(true);
      onSuggestionUpdate?.();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('409')) {
          setError('Suggestion was modified by another user. Please refresh.');
        } else {
          setError(err.message);
        }
      }
    }
  };

  if (isLoading && suggestions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Text variant="body" className="text-text-secondary">
          Loading suggestions...
        </Text>
      </div>
    );
  }

  if (error && suggestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Text variant="body" className="mb-4 text-error">
          {error}
        </Text>
        <Button variant="secondary" onClick={() => loadSuggestions(true)}>
          Retry
        </Button>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Text variant="body" className="text-text-secondary">
          {statusFilter
            ? `No ${statusFilter} suggestions found.`
            : 'No suggestions yet. Create your first suggestion!'}
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-error/10/20 rounded-md border border-error p-4">
          <Text variant="body" className="text-error">
            {error}
          </Text>
        </div>
      )}

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.suggestionId}
            suggestion={suggestion}
            isAdmin={isAdmin}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button variant="secondary" onClick={() => loadSuggestions(false)} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
