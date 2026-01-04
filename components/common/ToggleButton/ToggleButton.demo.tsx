/**
 * ToggleButton Component Demo
 *
 * Example usage of the ToggleButton component with various configurations.
 * This file demonstrates all available props and variants.
 */

'use client';

import { useState } from 'react';
import { ToggleButton } from './ToggleButton';
import { Card } from '@/components/common/Card/Card';
import { Text } from '@/components/common/Text/Text';

export function ToggleButtonDemo() {
  const [basicToggle, setBasicToggle] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [dangerMode, setDangerMode] = useState(false);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <div>
        <Text variant="h1">ToggleButton Component</Text>
        <Text variant="body" className="mt-2 text-text-secondary">
          Interactive examples of the ToggleButton component with all variants and configurations.
        </Text>
      </div>

      {/* Basic Usage */}
      <Card>
        <Text variant="h3" className="mb-4">
          Basic Usage
        </Text>
        <div className="space-y-4">
          <ToggleButton checked={basicToggle} onChange={setBasicToggle} label="Basic toggle" />

          <ToggleButton
            checked={darkMode}
            onChange={setDarkMode}
            label="Dark mode"
            description="Enable dark theme for better visibility in low light"
          />

          <ToggleButton
            checked={notifications}
            onChange={setNotifications}
            label="Push notifications"
            helpText="Receive notifications about important updates"
          />
        </div>
      </Card>

      {/* Variants */}
      <Card>
        <Text variant="h3" className="mb-4">
          Variants
        </Text>
        <div className="space-y-4">
          <ToggleButton
            checked={notifications}
            onChange={setNotifications}
            label="Primary (default)"
            variant="primary"
          />

          <ToggleButton
            checked={notifications}
            onChange={setNotifications}
            label="Secondary"
            variant="secondary"
          />

          <ToggleButton
            checked={notifications}
            onChange={setNotifications}
            label="Tertiary"
            variant="tertiary"
          />

          <ToggleButton
            checked={autoSave}
            onChange={setAutoSave}
            label="Success (Auto-save enabled)"
            variant="success"
          />

          <ToggleButton
            checked={marketingEmails}
            onChange={setMarketingEmails}
            label="Warning (Marketing emails)"
            variant="warning"
          />

          <ToggleButton
            checked={dangerMode}
            onChange={setDangerMode}
            label="Error (Danger mode)"
            variant="error"
            description="This is a destructive action"
          />
        </div>
      </Card>

      {/* Sizes */}
      <Card>
        <Text variant="h3" className="mb-4">
          Sizes
        </Text>
        <div className="space-y-4">
          <ToggleButton
            checked={notifications}
            onChange={setNotifications}
            label="Small"
            size="sm"
          />

          <ToggleButton
            checked={notifications}
            onChange={setNotifications}
            label="Medium (default)"
            size="md"
          />

          <ToggleButton
            checked={notifications}
            onChange={setNotifications}
            label="Large"
            size="lg"
          />
        </div>
      </Card>

      {/* States */}
      <Card>
        <Text variant="h3" className="mb-4">
          States
        </Text>
        <div className="space-y-4">
          <ToggleButton checked={false} onChange={() => {}} label="Disabled (Off)" disabled />

          <ToggleButton checked={true} onChange={() => {}} label="Disabled (On)" disabled />

          <ToggleButton
            checked={false}
            onChange={setBasicToggle}
            label="Toggle with error"
            error={!basicToggle ? 'You must enable this option' : undefined}
          />
        </div>
      </Card>

      {/* Form Integration */}
      <Card>
        <Text variant="h3" className="mb-4">
          Form Integration
        </Text>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Form submitted!');
          }}
          className="space-y-4"
        >
          <ToggleButton
            checked={marketingEmails}
            onChange={setMarketingEmails}
            label="Subscribe to newsletter"
            name="newsletter_subscription"
            description="Receive updates about new features and products"
          />

          <ToggleButton
            checked={basicToggle}
            onChange={setBasicToggle}
            label="I agree to the terms and conditions"
            name="terms_agreement"
            error={!basicToggle ? 'You must accept the terms to continue' : undefined}
          />

          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-primary-contrast hover:bg-primary-hover"
            disabled={!basicToggle}
          >
            Submit
          </button>
        </form>
      </Card>

      {/* Current State Display */}
      <Card>
        <Text variant="h3" className="mb-4">
          Current State
        </Text>
        <div className="space-y-2 text-sm">
          <div>Basic Toggle: {basicToggle ? '✓ On' : '✗ Off'}</div>
          <div>Dark Mode: {darkMode ? '✓ On' : '✗ Off'}</div>
          <div>Notifications: {notifications ? '✓ On' : '✗ Off'}</div>
          <div>Marketing Emails: {marketingEmails ? '✓ On' : '✗ Off'}</div>
          <div>Auto Save: {autoSave ? '✓ On' : '✗ Off'}</div>
          <div>Danger Mode: {dangerMode ? '✓ On' : '✗ Off'}</div>
        </div>
      </Card>
    </div>
  );
}
