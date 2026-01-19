import React from 'react';
import { render, screen } from '@testing-library/react';
import CredentialForms from '@/app/settings/user-settings/credential-forms';

describe('User Settings credential forms', () => {
  it('renders change email and change password sections', () => {
    render(<CredentialForms />);

    expect(screen.getByText(/Change Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Change Password/i)).toBeInTheDocument();
  });

  it('renders current password inputs for both flows', () => {
    render(<CredentialForms />);

    expect(screen.getAllByLabelText(/Current Password/i).length).toBeGreaterThanOrEqual(2);
  });
});
