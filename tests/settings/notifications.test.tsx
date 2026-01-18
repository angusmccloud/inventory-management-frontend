import React from 'react';
import { render, screen } from '@testing-library/react';
import NotificationsSettingsPage from '@/app/settings/notifications/page';

describe('NotificationsSettingsPage', () => {
  it('renders header', () => {
    render(<NotificationsSettingsPage /> as any);
    expect(screen.getByText(/Notification Preferences/i)).toBeInTheDocument();
  });
});
