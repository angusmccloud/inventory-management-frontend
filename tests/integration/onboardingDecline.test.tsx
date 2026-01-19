/**
 * Tests: Pending invite decline flow
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

const mockReplace = jest.fn();
const mockDeclineAll = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock('@/hooks/usePendingInvites', () => ({
  usePendingInvites: () => ({
    data: {
      invites: [
        {
          inviteId: 'invite-1',
          familyId: 'family-1',
          familyName: 'Smith Family',
          inviterName: 'Alex',
          roleOffered: 'admin',
          expiresAt: new Date().toISOString(),
          status: 'PENDING',
        },
      ],
      decisionToken: 'token',
    },
    isLoading: false,
    error: null,
    selectedInviteId: 'invite-1',
    expandedInviteId: null,
    selectInvite: jest.fn(),
    toggleDetails: jest.fn(),
    acceptInvite: jest.fn(),
    declineInvite: jest.fn(),
    declineAll: mockDeclineAll,
  }),
}));

describe('Pending invite decline flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDeclineAll.mockResolvedValue({
      inviteId: 'all',
      familyId: 'family-1',
      action: 'DECLINED',
      membershipId: null,
      auditId: 'audit-1',
      redirect: '/family/create',
    });
  });

  it('routes to create-family after decline-all', async () => {
    const user = userEvent.setup();
    const PendingInvitePage = (await import('../../app/(auth)/register/pending-invite/page'))
      .default;

    render(<PendingInvitePage />);

    await user.click(screen.getByRole('button', { name: 'Create my own family' }));

    expect(mockDeclineAll).toHaveBeenCalledWith({
      decisionToken: 'token',
      reason: 'Create my own family',
    });
    expect(mockReplace).toHaveBeenCalledWith('/family/create');
  });
});
