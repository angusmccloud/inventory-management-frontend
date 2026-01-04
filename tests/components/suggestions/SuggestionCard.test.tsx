/**
 * Component Tests for SuggestionCard
 *
 * Tests approve/reject button visibility based on role and status,
 * status badges, and user interactions.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SuggestionCard } from '../../../components/suggestions/SuggestionCard';
import { Suggestion } from '../../../types/entities';

describe('SuggestionCard', () => {
  const baseSuggestion: Suggestion = {
    suggestionId: 'suggestion-1',
    familyId: 'family-1',
    suggestedBy: 'member-1',
    suggestedByName: 'John Doe',
    type: 'add_to_shopping',
    itemId: 'item-1',
    itemNameSnapshot: 'Milk',
    status: 'pending',
    version: 1,
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
  };

  const mockOnApprove = jest.fn();
  const mockOnReject = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Status Badge Display', () => {
    it('should show yellow badge for pending status', () => {
      render(
        <SuggestionCard
          suggestion={baseSuggestion}
          isAdmin={true}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      const badge = screen.getByText(/pending/i);
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('warning'); // assuming Badge variant classes
    });

    it('should show green badge for approved status', () => {
      const approvedSuggestion = {
        ...baseSuggestion,
        status: 'approved' as const,
        reviewedBy: 'admin-1',
        reviewedAt: '2025-12-02T10:00:00Z',
      };

      render(<SuggestionCard suggestion={approvedSuggestion} isAdmin={true} />);

      const badge = screen.getByText(/approved/i);
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('success');
    });

    it('should show red badge for rejected status', () => {
      const rejectedSuggestion = {
        ...baseSuggestion,
        status: 'rejected' as const,
        reviewedBy: 'admin-1',
        reviewedAt: '2025-12-02T10:00:00Z',
        rejectionNotes: 'Not needed',
      };

      render(<SuggestionCard suggestion={rejectedSuggestion} isAdmin={true} />);

      const badge = screen.getByText(/rejected/i);
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('error');
    });
  });

  describe('Button Visibility - Admin vs Suggester', () => {
    it('should show approve/reject buttons for admin on pending suggestions', () => {
      render(
        <SuggestionCard
          suggestion={baseSuggestion}
          isAdmin={true}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      expect(screen.getByRole('button', { name: /approve/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reject/i })).toBeInTheDocument();
    });

    it('should hide approve/reject buttons for suggester', () => {
      render(<SuggestionCard suggestion={baseSuggestion} isAdmin={false} />);

      expect(screen.queryByRole('button', { name: /approve/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /reject/i })).not.toBeInTheDocument();
    });

    it('should hide buttons when suggestion is already approved', () => {
      const approvedSuggestion = {
        ...baseSuggestion,
        status: 'approved' as const,
        reviewedBy: 'admin-1',
        reviewedAt: '2025-12-02T10:00:00Z',
      };

      render(
        <SuggestionCard
          suggestion={approvedSuggestion}
          isAdmin={true}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      expect(screen.queryByRole('button', { name: /approve/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /reject/i })).not.toBeInTheDocument();
    });

    it('should hide buttons when suggestion is already rejected', () => {
      const rejectedSuggestion = {
        ...baseSuggestion,
        status: 'rejected' as const,
        reviewedBy: 'admin-1',
        reviewedAt: '2025-12-02T10:00:00Z',
      };

      render(
        <SuggestionCard
          suggestion={rejectedSuggestion}
          isAdmin={true}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      expect(screen.queryByRole('button', { name: /approve/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /reject/i })).not.toBeInTheDocument();
    });

    it('should hide buttons when callbacks are not provided', () => {
      render(<SuggestionCard suggestion={baseSuggestion} isAdmin={true} />);

      expect(screen.queryByRole('button', { name: /approve/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /reject/i })).not.toBeInTheDocument();
    });
  });

  describe('Suggestion Content Display', () => {
    it('should display add_to_shopping suggestion details', () => {
      render(<SuggestionCard suggestion={baseSuggestion} isAdmin={true} />);

      expect(screen.getByText('Milk')).toBeInTheDocument();
      expect(screen.getByText(/add to shopping/i)).toBeInTheDocument();
      expect(screen.getByText(/suggested by john doe/i)).toBeInTheDocument();
    });

    it('should display create_item suggestion details', () => {
      const createItemSuggestion: Suggestion = {
        suggestionId: 'suggestion-2',
        familyId: 'family-1',
        suggestedBy: 'member-1',
        suggestedByName: 'Jane Smith',
        type: 'create_item',
        proposedItemName: 'Organic Bread',
        proposedQuantity: 5,
        proposedThreshold: 1,
        status: 'pending',
        version: 1,
        createdAt: '2025-12-01T10:00:00Z',
        updatedAt: '2025-12-01T10:00:00Z',
      };

      render(<SuggestionCard suggestion={createItemSuggestion} isAdmin={true} />);

      expect(screen.getByText('Organic Bread')).toBeInTheDocument();
      expect(screen.getByText(/new item/i)).toBeInTheDocument();
      expect(screen.getByText(/quantity/i)).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText(/threshold/i)).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should display notes when provided', () => {
      const suggestionWithNotes = {
        ...baseSuggestion,
        notes: 'Running low on this item',
      };

      render(<SuggestionCard suggestion={suggestionWithNotes} isAdmin={true} />);

      expect(screen.getByText('Running low on this item')).toBeInTheDocument();
    });

    it('should display rejection notes when suggestion is rejected', () => {
      const rejectedSuggestion = {
        ...baseSuggestion,
        status: 'rejected' as const,
        reviewedBy: 'admin-1',
        reviewedAt: '2025-12-02T10:00:00Z',
        rejectionNotes: 'Already have enough stock',
      };

      render(<SuggestionCard suggestion={rejectedSuggestion} isAdmin={true} />);

      expect(screen.getByText(/reason/i)).toBeInTheDocument();
      expect(screen.getByText('Already have enough stock')).toBeInTheDocument();
    });

    it('should display reviewed date for approved suggestions', () => {
      const approvedSuggestion = {
        ...baseSuggestion,
        status: 'approved' as const,
        reviewedBy: 'admin-1',
        reviewedAt: '2025-12-02T15:30:00Z',
      };

      render(<SuggestionCard suggestion={approvedSuggestion} isAdmin={true} />);

      expect(screen.getByText(/approved on/i)).toBeInTheDocument();
    });
  });

  describe('Approve/Reject Actions', () => {
    it('should call onApprove when approve button is clicked', async () => {
      mockOnApprove.mockResolvedValue(undefined);

      render(
        <SuggestionCard
          suggestion={baseSuggestion}
          isAdmin={true}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      const approveButton = screen.getByRole('button', { name: /approve/i });
      fireEvent.click(approveButton);

      await waitFor(() => {
        expect(mockOnApprove).toHaveBeenCalledWith('suggestion-1');
      });
    });

    it('should open rejection modal when reject button is clicked', () => {
      render(
        <SuggestionCard
          suggestion={baseSuggestion}
          isAdmin={true}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      const rejectButton = screen.getByRole('button', { name: /reject/i });
      fireEvent.click(rejectButton);

      expect(screen.getByText(/reject suggestion/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/rejection reason/i)).toBeInTheDocument();
    });

    it('should call onReject with notes when rejection is confirmed', async () => {
      mockOnReject.mockResolvedValue(undefined);

      render(
        <SuggestionCard
          suggestion={baseSuggestion}
          isAdmin={true}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      const rejectButton = screen.getByRole('button', { name: /^reject$/i });
      fireEvent.click(rejectButton);

      const notesInput = screen.getByPlaceholderText(/rejection reason/i);
      fireEvent.change(notesInput, { target: { value: 'Already in stock' } });

      const confirmButton = screen.getByRole('button', { name: /reject suggestion/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockOnReject).toHaveBeenCalledWith('suggestion-1', 'Already in stock');
      });
    });

    it('should close rejection modal when cancel is clicked', () => {
      render(
        <SuggestionCard
          suggestion={baseSuggestion}
          isAdmin={true}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      const rejectButton = screen.getByRole('button', { name: /^reject$/i });
      fireEvent.click(rejectButton);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(screen.queryByText(/reject suggestion/i)).not.toBeInTheDocument();
      expect(mockOnReject).not.toHaveBeenCalled();
    });

    it('should disable buttons while approving', async () => {
      mockOnApprove.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      render(
        <SuggestionCard
          suggestion={baseSuggestion}
          isAdmin={true}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      const approveButton = screen.getByRole('button', { name: /approve/i });
      const rejectButton = screen.getByRole('button', { name: /reject/i });

      fireEvent.click(approveButton);

      expect(approveButton).toBeDisabled();
      expect(rejectButton).toBeDisabled();
    });

    it('should enforce 500 character limit on rejection notes', () => {
      render(
        <SuggestionCard
          suggestion={baseSuggestion}
          isAdmin={true}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      );

      const rejectButton = screen.getByRole('button', { name: /^reject$/i });
      fireEvent.click(rejectButton);

      const notesInput = screen.getByPlaceholderText(/rejection reason/i) as HTMLTextAreaElement;
      expect(notesInput.maxLength).toBe(500);
    });
  });
});
