import React from 'react';
import { render, screen } from '@testing-library/react';
import DeleteAccountDialog from '@/app/settings/user-settings/delete-account-dialog';

describe('DeleteAccountDialog', () => {
  it('renders confirmation title', () => {
    render(<DeleteAccountDialog open onClose={() => undefined} onConfirm={async () => undefined} />);
    expect(screen.getByText(/Delete Account/i)).toBeInTheDocument();
  });

  it('renders acknowledgement input', () => {
    render(<DeleteAccountDialog open onClose={() => undefined} onConfirm={async () => undefined} />);
    expect(screen.getByLabelText(/Type DELETE/i)).toBeInTheDocument();
  });
});
