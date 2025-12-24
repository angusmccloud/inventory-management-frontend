/**
 * Theme Preview Component
 * 
 * Visual demonstration of all theme colors and components.
 * Useful for testing theme consistency and accessibility.
 * 
 * This component is for development/testing only.
 */

'use client';

import { getThemeClasses } from '@/lib/theme';

export default function ThemePreview() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Theme Preview</h1>
          <p className="text-text-secondary">
            Visual demonstration of the theme system. Toggle your system dark mode to see the changes.
          </p>
        </div>

        {/* Brand Colors */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Brand Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary text-primary-contrast p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Primary</h3>
              <p className="text-sm opacity-90">Main brand color for primary actions</p>
            </div>
            <div className="bg-secondary text-secondary-contrast p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Secondary</h3>
              <p className="text-sm opacity-90">Accent color for secondary actions</p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Buttons</h2>
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex flex-wrap gap-4">
              <button className="bg-primary text-primary-contrast hover:bg-primary-hover px-4 py-2 rounded transition-colors">
                Primary Button
              </button>
              <button className="bg-secondary text-secondary-contrast hover:bg-secondary-hover px-4 py-2 rounded transition-colors">
                Secondary Button
              </button>
              <button className="bg-transparent border border-border text-text-primary hover:bg-surface-hover px-4 py-2 rounded transition-colors">
                Outline Button
              </button>
              <button className="bg-surface text-text-primary hover:bg-surface-hover px-4 py-2 rounded transition-colors">
                Surface Button
              </button>
            </div>
          </div>
        </section>

        {/* Semantic Colors */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Semantic Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-success text-success-contrast p-4 rounded-lg flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="font-semibold">Success</h3>
                <p className="text-sm opacity-90">Operation completed successfully</p>
              </div>
            </div>
            <div className="bg-error text-error-contrast p-4 rounded-lg flex items-center gap-3">
              <span className="text-2xl">✗</span>
              <div>
                <h3 className="font-semibold">Error</h3>
                <p className="text-sm opacity-90">Operation failed</p>
              </div>
            </div>
            <div className="bg-warning text-warning-contrast p-4 rounded-lg flex items-center gap-3">
              <span className="text-2xl">⚠</span>
              <div>
                <h3 className="font-semibold">Warning</h3>
                <p className="text-sm opacity-90">Proceed with caution</p>
              </div>
            </div>
            <div className="bg-info text-info-contrast p-4 rounded-lg flex items-center gap-3">
              <span className="text-2xl">ℹ</span>
              <div>
                <h3 className="font-semibold">Info</h3>
                <p className="text-sm opacity-90">Additional information</p>
              </div>
            </div>
          </div>
        </section>

        {/* Surface Variants */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Surface Variants</h2>
          <div className="space-y-4">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="font-semibold text-text-primary mb-2">Default Surface</h3>
              <p className="text-text-secondary text-sm">Used for cards, panels, and main content areas</p>
            </div>
            <div className="bg-surface-elevated border border-border rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-text-primary mb-2">Elevated Surface</h3>
              <p className="text-text-secondary text-sm">Used for modals, dropdowns, and overlays</p>
            </div>
            <div className="bg-surface-hover border border-border rounded-lg p-6">
              <h3 className="font-semibold text-text-primary mb-2">Hover Surface</h3>
              <p className="text-text-secondary text-sm">Hover state for interactive surfaces</p>
            </div>
          </div>
        </section>

        {/* Text Hierarchy */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Text Hierarchy</h2>
          <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-text-primary text-xl font-bold">Primary Text</h3>
              <p className="text-text-primary">
                This is primary text used for headings, body content, and important information.
              </p>
            </div>
            <div>
              <h3 className="text-text-primary text-xl font-bold">Secondary Text</h3>
              <p className="text-text-secondary">
                This is secondary text used for captions, labels, and supporting information.
              </p>
            </div>
            <div>
              <h3 className="text-text-primary text-xl font-bold">Disabled Text</h3>
              <p className="text-text-disabled">
                This is disabled text used for inactive or unavailable content.
              </p>
            </div>
          </div>
        </section>

        {/* Form Elements */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Form Elements</h2>
          <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-text-primary font-medium mb-2">Text Input</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-surface border border-border text-text-primary rounded focus:border-border-focus focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Enter text..."
              />
            </div>
            <div>
              <label className="block text-text-primary font-medium mb-2">Select Dropdown</label>
              <select className="w-full px-3 py-2 bg-surface border border-border text-text-primary rounded focus:border-border-focus focus:ring-2 focus:ring-primary/20 outline-none">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <div>
              <label className="block text-text-primary font-medium mb-2">Textarea</label>
              <textarea
                className="w-full px-3 py-2 bg-surface border border-border text-text-primary rounded focus:border-border-focus focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                rows={3}
                placeholder="Enter description..."
              />
            </div>
          </div>
        </section>

        {/* Cards and Lists */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Cards and Lists</h2>
          <div className="space-y-4">
            <div className="bg-surface border border-border rounded-lg p-4 hover:bg-surface-hover cursor-pointer transition-colors">
              <h3 className="text-text-primary font-semibold mb-1">Hoverable Card</h3>
              <p className="text-text-secondary text-sm">Hover over this card to see the hover state</p>
            </div>
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border hover:bg-surface-hover transition-colors">
                <h4 className="text-text-primary font-medium">List Item 1</h4>
                <p className="text-text-secondary text-sm">Description for item 1</p>
              </div>
              <div className="p-4 border-b border-border hover:bg-surface-hover transition-colors">
                <h4 className="text-text-primary font-medium">List Item 2</h4>
                <p className="text-text-secondary text-sm">Description for item 2</p>
              </div>
              <div className="p-4 hover:bg-surface-hover transition-colors">
                <h4 className="text-text-primary font-medium">List Item 3</h4>
                <p className="text-text-secondary text-sm">Description for item 3</p>
              </div>
            </div>
          </div>
        </section>

        {/* Helper Functions */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Theme Helper Functions</h2>
          <div className="bg-surface border border-border rounded-lg p-6">
            <p className="text-text-secondary mb-4">
              Using <code className="bg-surface-hover px-2 py-1 rounded text-text-primary">getThemeClasses()</code> helper:
            </p>
            <div className="flex flex-wrap gap-4">
              <button className={`${getThemeClasses('button', 'primary')} px-4 py-2 rounded`}>
                Primary
              </button>
              <button className={`${getThemeClasses('button', 'secondary')} px-4 py-2 rounded`}>
                Secondary
              </button>
              <button className={`${getThemeClasses('button', 'outline')} px-4 py-2 rounded`}>
                Outline
              </button>
              <input
                type="text"
                className={`${getThemeClasses('input')} px-3 py-2 rounded`}
                placeholder="Input field..."
              />
            </div>
          </div>
        </section>

        {/* Empty State */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Empty State</h2>
          <div className="bg-surface border border-border rounded-lg p-12 text-center">
            <div className="text-text-disabled text-5xl mb-4">📭</div>
            <h3 className="text-text-primary font-semibold text-lg mb-2">No Items Found</h3>
            <p className="text-text-secondary mb-4">
              Get started by adding your first item
            </p>
            <button className="bg-primary text-primary-contrast hover:bg-primary-hover px-6 py-2 rounded transition-colors">
              Add Item
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
