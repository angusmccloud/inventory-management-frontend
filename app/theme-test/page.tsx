/**
 * Theme Test Page
 * 
 * Page to verify theme colors and reusable components.
 * Navigate to /theme-test to see this page.
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';
import { Alert } from '@/components/common/Alert/Alert';
import { Input } from '@/components/common/Input/Input';
import { Select } from '@/components/common/Select/Select';

export default function ThemeTestPage() {
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Theme Test Page
          </h1>
          <p className="text-text-secondary">
            Toggle your system dark mode to see the theme change automatically.
          </p>
        </div>

        {/* Color Swatches */}
        <Card elevation="low" padding="lg">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Theme Colors
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-16 rounded-md bg-primary" />
              <p className="text-sm text-text-secondary">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-md bg-secondary" />
              <p className="text-sm text-text-secondary">Secondary</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-md bg-tertiary" />
              <p className="text-sm text-text-secondary">Tertiary</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-md bg-success" />
              <p className="text-sm text-text-secondary">Success</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-md bg-warning" />
              <p className="text-sm text-text-secondary">Warning</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded-md bg-error" />
              <p className="text-sm text-text-secondary">Error</p>
            </div>
          </div>
        </Card>

        {/* Cards */}
        <div>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Card Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card elevation="low" padding="md">
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Standard Card
              </h3>
              <p className="text-text-secondary">
                Card with surface background and automatic theme switching.
              </p>
            </Card>

            <Card elevation="medium" padding="lg" interactive>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Interactive Card
              </h3>
              <p className="text-text-secondary">
                Hover over this card to see hover effects.
              </p>
            </Card>
          </div>
        </div>

        {/* Buttons */}
        <Card elevation="low" padding="lg">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Button Variants
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="secondary" size="lg">Large</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </Card>

        {/* Alerts */}
        <div>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Alert Components
          </h2>
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

        {/* Form Elements */}
        <Card elevation="low" padding="lg">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Form Components
          </h2>
          <div className="space-y-4 max-w-md">
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

        {/* Surface Examples */}
        <Card elevation="low" padding="lg">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Surface Variants
          </h2>
          <div className="space-y-3">
            <div className="p-4 rounded-md bg-surface border border-border">
              <p className="text-text-primary">Surface (default)</p>
            </div>
            <div className="p-4 rounded-md bg-surface-elevated border border-border">
              <p className="text-text-primary">Surface Elevated</p>
            </div>
            <div className="p-4 rounded-md bg-surface-hover border border-border">
              <p className="text-text-primary">Surface Hover</p>
            </div>
          </div>
        </Card>

        {/* Testing Instructions */}
        <Card elevation="low" padding="md">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Testing Instructions
          </h3>
          <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
            <li>macOS: System Settings → Appearance → Light/Dark</li>
            <li>Windows: Settings → Personalization → Colors</li>
            <li>Browser DevTools: Cmd/Ctrl+Shift+P → "Rendering" → "prefers-color-scheme"</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
