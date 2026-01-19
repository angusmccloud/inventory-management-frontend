/**
 * Tests: InvitationDecisionList
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { InvitationDecisionList } from '@/components/common';
import type { PendingInvitation } from '@/types/invitations';

const invites: PendingInvitation[] = [
  {
    inviteId: 'invite-1',
    familyId: 'family-1',
    familyName: 'Smith Family',
    inviterName: 'Alex',
    roleOffered: 'admin',
    expiresAt: new Date().toISOString(),
    status: 'PENDING',
  },
  {
    inviteId: 'invite-2',
    familyId: 'family-2',
    familyName: 'Lee Family',
    inviterName: 'Jordan',
    roleOffered: 'admin',
    expiresAt: new Date().toISOString(),
    status: 'PENDING',
  },
];

describe('InvitationDecisionList', () => {
  it('invokes selection and detail callbacks', async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    const onToggleDetails = jest.fn();

    render(
      <InvitationDecisionList
        invites={invites}
        selectedInviteId={null}
        expandedInviteId={null}
        onSelect={onSelect}
        onToggleDetails={onToggleDetails}
      />
    );

    await user.click(screen.getAllByRole('button', { name: 'Select' })[0]!);
    expect(onSelect).toHaveBeenCalledWith('invite-1');

    await user.click(screen.getAllByRole('button', { name: 'View details' })[0]!);
    expect(onToggleDetails).toHaveBeenCalledWith('invite-1');
  });
});
