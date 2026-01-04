'use client';

import { useState } from 'react';
import { Card, Badge, Button, Text } from '@/components/common';
import { Suggestion } from '@/types/entities';

interface SuggestionCardProps {
  suggestion: Suggestion;
  isAdmin: boolean;
  onApprove?: (suggestionId: string) => Promise<void>;
  onReject?: (suggestionId: string, rejectionNotes?: string) => Promise<void>;
}

export function SuggestionCard({ suggestion, isAdmin, onApprove, onReject }: SuggestionCardProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState('');

  const handleApprove = async () => {
    if (!onApprove) return;
    try {
      setIsApproving(true);
      await onApprove(suggestion.suggestionId);
    } catch (error) {
      console.error('Failed to approve suggestion:', error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!onReject) return;
    try {
      setIsRejecting(true);
      await onReject(suggestion.suggestionId, rejectionNotes || undefined);
      setShowRejectModal(false);
      setRejectionNotes('');
    } catch (error) {
      console.error('Failed to reject suggestion:', error);
    } finally {
      setIsRejecting(false);
    }
  };

  const getStatusBadge = () => {
    switch (suggestion.status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge>{suggestion.status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const showActions = isAdmin && suggestion.status === 'pending' && onApprove && onReject;

  return (
    <>
      <Card className="transition-shadow hover:shadow-md">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                {getStatusBadge()}
                <Badge variant="info">
                  {suggestion.type === 'add_to_shopping' ? 'Add to Shopping' : 'New Item'}
                </Badge>
              </div>
              <Text variant="caption" className="text-text-default">
                Suggested by {suggestion.suggestedByName} on {formatDate(suggestion.createdAt)}
              </Text>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            {suggestion.type === 'add_to_shopping' ? (
              <>
                <Text variant="body" className="font-medium">
                  {suggestion.itemNameSnapshot || 'Item'}
                </Text>
                <Text variant="caption" className="text-text-default">
                  Add to shopping list
                </Text>
              </>
            ) : (
              <>
                <Text variant="body" className="font-medium">
                  {suggestion.proposedItemName}
                </Text>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <Text variant="caption" className="text-text-secondary">
                      Quantity:
                    </Text>
                    <Text variant="body">{suggestion.proposedQuantity}</Text>
                  </div>
                  <div>
                    <Text variant="caption" className="text-text-secondary">
                      Threshold:
                    </Text>
                    <Text variant="body">{suggestion.proposedThreshold}</Text>
                  </div>
                </div>
              </>
            )}

            {suggestion.notes && (
              <div className="border-t border-border pt-2">
                <Text variant="caption" className="mb-1 text-text-secondary">
                  Notes:
                </Text>
                <Text variant="body" className="text-text-default">
                  {suggestion.notes}
                </Text>
              </div>
            )}

            {suggestion.status !== 'pending' && suggestion.reviewedBy && (
              <div className="border-t border-border pt-2">
                <Text variant="caption" className="text-text-secondary">
                  {suggestion.status === 'approved' ? 'Approved' : 'Rejected'} on{' '}
                  {formatDate(suggestion.reviewedAt!)}
                </Text>
                {suggestion.rejectionNotes && (
                  <Text variant="body" className="mt-1 text-text-default">
                    Reason: {suggestion.rejectionNotes}
                  </Text>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 border-t border-border pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
              >
                {isApproving ? 'Approving...' : 'Approve'}
              </Button>
              <Button
                variant="warning"
                size="sm"
                onClick={() => setShowRejectModal(true)}
                disabled={isApproving || isRejecting}
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-surface p-6">
            <Text variant="h3" className="mb-4">
              Reject Suggestion
            </Text>
            <Text variant="body" className="mb-4 text-text-default">
              Optionally provide a reason for rejecting this suggestion.
            </Text>
            <textarea
              value={rejectionNotes}
              onChange={(e) => setRejectionNotes(e.target.value)}
              placeholder="Rejection reason (optional)"
              className="mb-4 w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-border dark:bg-surface-elevated dark:text-white"
              rows={3}
              maxLength={500}
            />
            <Text variant="caption" className="mb-4 text-text-secondary">
              {rejectionNotes.length}/500 characters
            </Text>
            <div className="flex justify-end gap-3">
              <Button
                variant="warning"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionNotes('');
                }}
                disabled={isRejecting}
              >
                Cancel
              </Button>
              <Button variant="warning" onClick={handleRejectSubmit} disabled={isRejecting}>
                {isRejecting ? 'Rejecting...' : 'Reject Suggestion'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
