/**
 * Theme Test Page
 *
 * Page to verify theme colors and reusable components.
 * Navigate to /theme-test to see this page.
 */

'use client';

import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  IconButton,
  Input,
  Link,
  LoadingSpinner,
  PageContainer,
  PageHeader,
  Radio,
  Select,
  TabNavigation,
  Text,
  ToggleButton,
} from '@/components/common';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { PencilIcon, TrashIcon, HeartIcon, BellIcon, UserIcon } from '@heroicons/react/24/outline';

export default function ThemeTestPage() {
  const { showSnackbar } = useSnackbar();
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [togglePrimary, setTogglePrimary] = useState(false);
  const [toggleSecondary, setToggleSecondary] = useState(true);
  const [toggleTertiary, setToggleTertiary] = useState(false);
  const [toggleSuccess, setToggleSuccess] = useState(true);
  const [toggleWarning, setToggleWarning] = useState(false);
  const [toggleError, setToggleError] = useState(false);
  const [toggleWithError, setToggleWithError] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [rememberPrefs, setRememberPrefs] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');

  return (
    <PageContainer>
      <PageHeader
        title="Theme Test Page"
        description="Toggle your system dark mode to see the theme change automatically"
      />

      <div className="space-y-8">
        {/* Color Swatches */}
        <Card elevation="low" padding="lg">
          <Text as="h2" variant="h2" className="mb-4">
            Theme Colors
          </Text>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="h-16 rounded-md bg-primary" />
              <Text variant="bodySmall" color="secondary">
                Primary
              </Text>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-md bg-secondary" />
              <Text variant="bodySmall" color="secondary">
                Secondary
              </Text>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-md bg-tertiary" />
              <Text variant="bodySmall" color="secondary">
                Tertiary
              </Text>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-md bg-success" />
              <Text variant="bodySmall" color="secondary">
                Success
              </Text>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-md bg-warning" />
              <Text variant="bodySmall" color="secondary">
                Warning
              </Text>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-md bg-error" />
              <Text variant="bodySmall" color="secondary">
                Error
              </Text>
            </div>
          </div>
        </Card>

        {/* Cards */}
        <div>
          <Text as="h2" variant="h2" className="mb-4">
            Card Components
          </Text>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card elevation="low" padding="md">
              <Text as="h3" variant="h3" className="mb-2">
                Standard Card
              </Text>
              <Text color="secondary">
                Card with surface background and automatic theme switching.
              </Text>
            </Card>

            <Card elevation="medium" padding="lg" interactive>
              <Text as="h3" variant="h3" className="mb-2">
                Interactive Card
              </Text>
              <Text color="secondary">Hover over this card to see hover effects.</Text>
            </Card>
          </div>
        </div>

        {/* Buttons */}
        <Card elevation="low" padding="lg">
          <Text as="h2" variant="h2" className="mb-4">
            Button Variants
          </Text>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="secondary" size="lg">
              Large
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </Card>

        {/* Alerts */}
        <div>
          <Text as="h2" variant="h2" className="mb-4">
            Alert Components
          </Text>
          <div className="space-y-3">
            <Alert severity="info" title="Information">
              This is an informational message using the info color.
            </Alert>
            <Alert severity="success" title="Success">
              Operation completed successfully using the success color.
            </Alert>
            <Alert severity="warning" title="Warning">
              Please review this warning message using the warning color.
            </Alert>
            <Alert severity="error" title="Error">
              An error occurred using the error color.
            </Alert>
          </div>
        </div>

        {/* Snackbar */}
        <Card elevation="low" padding="lg">
          <Text as="h2" variant="h2" className="mb-4">
            Snackbar Notifications
          </Text>
          <Text variant="body" color="secondary" className="mb-4">
            Click the buttons below to trigger snackbar notifications. They will appear at the
            bottom center of the screen and auto-hide after 5 seconds.
          </Text>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() =>
                showSnackbar({
                  variant: 'info',
                  text: 'This is an informational snackbar message',
                })
              }
            >
              Show Info Snackbar
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                showSnackbar({
                  variant: 'success',
                  text: 'Operation completed successfully!',
                })
              }
            >
              Show Success Snackbar
            </Button>
            <Button
              variant="warning"
              onClick={() =>
                showSnackbar({
                  variant: 'warning',
                  text: 'Please review this warning message',
                })
              }
            >
              Show Warning Snackbar
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                showSnackbar({
                  variant: 'error',
                  text: 'An error occurred. Please try again.',
                })
              }
            >
              Show Error Snackbar
            </Button>
          </div>
        </Card>

        {/* Form Elements */}
        <Card elevation="low" padding="lg">
          <Text as="h2" variant="h2" className="mb-4">
            Form Components
          </Text>
          <div className="max-w-md space-y-4">
            <Input
              label="Text Input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter some text"
              helpText="This is a help text"
            />

            <Input
              label="Input with Error"
              value=""
              onChange={() => {}}
              error="This field is required"
            />

            <Select
              label="Select Dropdown"
              value={selectValue}
              onChange={setSelectValue}
              options={[
                { label: 'Option 1', value: '1' },
                { label: 'Option 2', value: '2' },
                { label: 'Option 3', value: '3' },
              ]}
              placeholder="Choose an option"
            />
          </div>
        </Card>

        {/* Toggle, Radio, and Checkbox Components */}
        <Card elevation="low" padding="lg">
          <Text as="h2" variant="h2" className="mb-4">
            Toggle, Radio & Checkbox Components
          </Text>
          <div className="max-w-md space-y-6">
            {/* Toggle Buttons */}
            <div>
              <Text as="h3" variant="h4" className="mb-3">
                Toggle Buttons
              </Text>
              <div className="space-y-3">
                <div>
                  <Text variant="label" className="mb-2">
                    Variants
                  </Text>
                  <div className="space-y-2">
                    <ToggleButton
                      checked={togglePrimary}
                      onChange={setTogglePrimary}
                      label="Primary variant"
                      variant="primary"
                    />
                    <ToggleButton
                      checked={toggleSecondary}
                      onChange={setToggleSecondary}
                      label="Secondary variant"
                      variant="secondary"
                    />
                    <ToggleButton
                      checked={toggleTertiary}
                      onChange={setToggleTertiary}
                      label="Tertiary variant"
                      variant="tertiary"
                    />
                    <ToggleButton
                      checked={toggleSuccess}
                      onChange={setToggleSuccess}
                      label="Success variant"
                      variant="success"
                    />
                    <ToggleButton
                      checked={toggleWarning}
                      onChange={setToggleWarning}
                      label="Warning variant"
                      variant="warning"
                    />
                    <ToggleButton
                      checked={toggleError}
                      onChange={setToggleError}
                      label="Error variant"
                      variant="error"
                    />
                  </div>
                </div>

                <div>
                  <Text variant="label" className="mb-2">
                    Sizes
                  </Text>
                  <div className="space-y-2">
                    <ToggleButton
                      checked={togglePrimary}
                      onChange={setTogglePrimary}
                      label="Small size"
                      size="sm"
                    />
                    <ToggleButton
                      checked={toggleSecondary}
                      onChange={setToggleSecondary}
                      label="Medium size (default)"
                      size="md"
                    />
                    <ToggleButton
                      checked={toggleSuccess}
                      onChange={setToggleSuccess}
                      label="Large size"
                      size="lg"
                    />
                  </div>
                </div>

                <div>
                  <Text variant="label" className="mb-2">
                    States
                  </Text>
                  <div className="space-y-2">
                    <ToggleButton
                      checked={toggleWithError}
                      onChange={setToggleWithError}
                      label="Toggle with error"
                      error={!toggleWithError ? 'This field is required' : undefined}
                    />
                    <ToggleButton
                      checked={false}
                      onChange={() => {}}
                      label="Disabled toggle"
                      disabled
                    />
                    <ToggleButton
                      checked={togglePrimary}
                      onChange={setTogglePrimary}
                      label="With description"
                      description="Additional context about this option"
                    />
                    <ToggleButton
                      checked={toggleSecondary}
                      onChange={setToggleSecondary}
                      label="With help text"
                      helpText="Helpful information about this setting"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Radio Buttons */}
            <div>
              <Text as="h3" variant="h4" className="mb-3">
                Radio Buttons
              </Text>
              <Radio
                name="example-radio"
                label="Choose an option"
                value={radioValue}
                onChange={setRadioValue}
                options={[
                  { label: 'Option 1', value: 'option1', description: 'First choice' },
                  { label: 'Option 2', value: 'option2', description: 'Second choice' },
                  { label: 'Option 3', value: 'option3', description: 'Third choice' },
                  { label: 'Disabled Option', value: 'option4', disabled: true },
                ]}
                helpText="Select one option from the list"
              />
            </div>

            {/* Checkboxes */}
            <div>
              <Text as="h3" variant="h4" className="mb-3">
                Checkboxes
              </Text>
              <div className="space-y-3">
                <Checkbox
                  checked={checkboxValue}
                  onChange={setCheckboxValue}
                  label="I agree to the terms and conditions"
                  required
                />

                <Checkbox
                  checked={rememberPrefs}
                  onChange={setRememberPrefs}
                  label="Remember my preferences"
                  description="Save your settings for future visits"
                />

                <Checkbox
                  checked={newsletter}
                  onChange={setNewsletter}
                  label="Subscribe to newsletter"
                  helpText="Receive weekly updates about new features"
                />

                <Checkbox checked={false} onChange={() => {}} label="Disabled checkbox" disabled />

                <Checkbox
                  checked={false}
                  onChange={() => {}}
                  label="Checkbox with error"
                  error="This field is required"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Badge Components */}
        <Card elevation="low" padding="lg">
          <Text as="h2" variant="h2" className="mb-4">
            Badge Components
          </Text>
          <div className="space-y-4">
            <div>
              <Text as="h3" variant="h4" className="mb-2">
                Status Badges
              </Text>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">Active</Badge>
                <Badge variant="error">Removed</Badge>
                <Badge variant="warning">Low Stock</Badge>
                <Badge variant="info">In Transit</Badge>
                <Badge variant="primary">Featured</Badge>
                <Badge variant="neutral">Draft</Badge>
              </div>
            </div>
            <div>
              <Text as="h3" variant="h4" className="mb-2">
                Count Badges
              </Text>
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">12</Badge>
                <Badge variant="error">3</Badge>
                <Badge variant="info" size="sm">
                  99+
                </Badge>
                <Badge variant="success" size="lg">
                  5
                </Badge>
              </div>
            </div>
            <div>
              <Text as="h3" variant="h4" className="mb-2">
                Dot Indicators
              </Text>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="success" dot />
                  <Text variant="bodySmall">Online</Text>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="error" dot />
                  <Text variant="bodySmall">Offline</Text>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning" dot />
                  <Text variant="bodySmall">Away</Text>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* IconButton Components */}
        <Card elevation="low" padding="lg">
          <Text as="h2" variant="h2" className="mb-4">
            Icon Buttons
          </Text>
          <div className="space-y-4">
            <div>
              <Text as="h3" variant="h4" className="mb-2">
                Variants
              </Text>
              <div className="flex flex-wrap gap-3">
                <IconButton
                  icon={<PencilIcon className="h-5 w-5" />}
                  aria-label="Edit item"
                  variant="primary"
                />
                <IconButton
                  icon={<TrashIcon className="h-5 w-5" />}
                  aria-label="Delete item"
                  variant="danger"
                />
                <IconButton
                  icon={<HeartIcon className="h-5 w-5" />}
                  aria-label="Favorite"
                  variant="secondary"
                />
                <IconButton
                  icon={<BellIcon className="h-5 w-5" />}
                  aria-label="Notifications"
                  variant="warning"
                />
              </div>
            </div>
            <div>
              <Text as="h3" variant="h4" className="mb-2">
                Sizes
              </Text>
              <div className="flex flex-wrap items-center gap-3">
                <IconButton
                  icon={<UserIcon className="h-4 w-4" />}
                  aria-label="Profile"
                  variant="primary"
                  size="sm"
                />
                <IconButton
                  icon={<UserIcon className="h-5 w-5" />}
                  aria-label="Profile"
                  variant="primary"
                  size="md"
                />
                <IconButton
                  icon={<UserIcon className="h-6 w-6" />}
                  aria-label="Profile"
                  variant="primary"
                  size="lg"
                />
              </div>
            </div>
            <div>
              <Text as="h3" variant="h4" className="mb-2">
                States
              </Text>
              <div className="flex flex-wrap gap-3">
                <IconButton
                  icon={<PencilIcon className="h-5 w-5" />}
                  aria-label="Edit"
                  variant="primary"
                  disabled
                />
                <IconButton
                  icon={<TrashIcon className="h-5 w-5" />}
                  aria-label="Delete"
                  variant="danger"
                  loading
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Link Components */}
        <Card elevation="low" padding="lg">
          <Text as="h2" variant="h2" className="mb-4">
            Link Components
          </Text>
          <div className="space-y-4">
            <div>
              <Text as="h3" variant="h4" className="mb-2">
                Variants
              </Text>
              <div className="space-y-2">
                <div>
                  <Link href="/inventory" variant="default">
                    Default internal link
                  </Link>
                </div>
                <div>
                  <Link href="/shopping-list" variant="primary">
                    Primary link with emphasis
                  </Link>
                </div>
                <div>
                  <Link href="/settings" variant="subtle">
                    Subtle link style
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <Text as="h3" variant="h4" className="mb-2">
                External Links
              </Text>
              <div className="space-y-2">
                <div>
                  <Link href="https://github.com" variant="default">
                    External link (auto-detected)
                  </Link>
                </div>
                <div>
                  <Link href="https://docs.example.com" variant="primary" showExternalIcon={false}>
                    External without icon
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* LoadingSpinner Components */}
        <Card elevation="low" padding="lg">
          <Text as="h2" variant="h2" className="mb-4">
            Loading Spinners
          </Text>
          <div className="space-y-4">
            <div>
              <Text as="h3" variant="h4" className="mb-2">
                Sizes
              </Text>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <LoadingSpinner size="sm" />
                  <Text variant="caption">Small</Text>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <LoadingSpinner size="md" />
                  <Text variant="caption">Medium</Text>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <LoadingSpinner size="lg" />
                  <Text variant="caption">Large</Text>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <LoadingSpinner size="xl" />
                  <Text variant="caption">Extra Large</Text>
                </div>
              </div>
            </div>
            <div>
              <Text as="h3" variant="h4" className="mb-2">
                Centered with Label
              </Text>
              <Card elevation="medium" padding="md">
                <LoadingSpinner size="lg" center label="Loading your items..." />
              </Card>
            </div>
          </div>
        </Card>

        {/* TabNavigation Components */}
        <Card elevation="low" padding="lg">
          <Text as="h2" variant="h2" className="mb-4">
            Tab Navigation
          </Text>
          <div className="space-y-6">
            <div>
              <Text as="h3" variant="h4" className="mb-3">
                Horizontal Tabs
              </Text>
              <TabNavigation
                tabs={[
                  { id: 'overview', label: 'Overview' },
                  { id: 'details', label: 'Details', badge: 3 },
                  { id: 'history', label: 'History' },
                  { id: 'settings', label: 'Settings', disabled: true },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
              <Card elevation="medium" padding="md" className="mt-4">
                <Text variant="body">
                  Active tab:{' '}
                  <Text as="span" variant="body" weight="semibold">
                    {activeTab}
                  </Text>
                </Text>
              </Card>
            </div>
            <div>
              <Text as="h3" variant="h4" className="mb-3">
                Responsive (Auto)
              </Text>
              <Text variant="bodySmall" color="secondary" className="mb-2">
                Shows dropdown on mobile, tabs on desktop
              </Text>
              <TabNavigation
                tabs={[
                  { id: 'all', label: 'All Items', badge: 12 },
                  { id: 'active', label: 'Active' },
                  { id: 'archived', label: 'Archived' },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
                responsiveMode="auto"
              />
            </div>
          </div>
        </Card>

        {/* Text Component */}
        <Card elevation="low" padding="lg">
          <Text as="h2" variant="h2" className="mb-4">
            Text Component
          </Text>
          <div className="space-y-4">
            <div>
              <Text as="h3" variant="h4" className="mb-2">
                Typography Variants
              </Text>
              <div className="space-y-2">
                <Text variant="h1">Heading 1 - Page Title</Text>
                <Text variant="h2">Heading 2 - Section</Text>
                <Text variant="h3">Heading 3 - Subsection</Text>
                <Text variant="h4">Heading 4 - Card Title</Text>
                <Text variant="h5">Heading 5 - Small Heading</Text>
                <Text variant="h6">Heading 6 - Tiny Heading</Text>
                <Text variant="body">Body text - Default paragraph text</Text>
                <Text variant="bodySmall">Body Small - Smaller text</Text>
                <Text variant="caption">Caption - Fine print and metadata</Text>
                <Text variant="label">Label - Form labels</Text>
              </div>
            </div>
            <div>
              <Text as="h3" variant="h4" className="mb-2">
                Color Variants
              </Text>
              <div className="space-y-1">
                <Text color="primary">Primary text color</Text>
                <Text color="secondary">Secondary text color</Text>
                <Text color="tertiary">Tertiary text color</Text>
                <Text color="success">Success text color</Text>
                <Text color="warning">Warning text color</Text>
                <Text color="error">Error text color</Text>
                <Text color="info">Info text color</Text>
              </div>
            </div>
            <div>
              <Text as="h3" variant="h4" className="mb-2">
                Font Weights
              </Text>
              <div className="space-y-1">
                <Text weight="normal">Normal weight text</Text>
                <Text weight="medium">Medium weight text</Text>
                <Text weight="semibold">Semibold weight text</Text>
                <Text weight="bold">Bold weight text</Text>
              </div>
            </div>
          </div>
        </Card>

        {/* Surface Examples */}
        <Card elevation="low" padding="lg">
          <Text as="h2" variant="h2" className="mb-4">
            Surface Variants
          </Text>
          <div className="space-y-3">
            <div className="rounded-md border border-border bg-surface p-4">
              <Text>Surface (default)</Text>
            </div>
            <div className="rounded-md border border-border bg-surface-elevated p-4">
              <Text>Surface Elevated</Text>
            </div>
            <div className="rounded-md border border-border bg-surface-hover p-4">
              <Text>Surface Hover</Text>
            </div>
          </div>
        </Card>

        {/* Testing Instructions */}
        <Card elevation="low" padding="md">
          <Text as="h3" variant="h3" className="mb-2">
            Testing Instructions
          </Text>
          <ul className="list-inside list-disc space-y-1 text-sm text-text-secondary">
            <li>macOS: System Settings → Appearance → Light/Dark</li>
            <li>Windows: Settings → Personalization → Colors</li>
            <li>Browser DevTools: Cmd/Ctrl+Shift+P → "Rendering" → "prefers-color-scheme"</li>
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}
