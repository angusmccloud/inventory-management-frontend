import React from 'react';
import { render, screen } from '@testing-library/react';
import NameForm from '@/app/settings/user-settings/name-form';

describe('User settings name form', () => {
  it('renders display name input', () => {
    render(<NameForm onSubmit={async () => undefined} />);
    expect(screen.getByLabelText(/Display Name/i)).toBeInTheDocument();
  });
});
