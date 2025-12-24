/**
 * Theme Test Page
 * 
 * Simple page to verify dark mode is working.
 * Navigate to /theme-test to see this page.
 */

export default function ThemeTestPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Theme Test Page
        </h1>
        
        <p className="text-gray-700 dark:text-gray-300">
          Toggle your system dark mode to see the theme change automatically.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Light/Dark Card
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              This card should have white background in light mode and dark gray in dark mode.
            </p>
          </div>

          <div className="bg-blue-500 dark:bg-blue-600 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              Primary Color Card
            </h2>
            <p className="opacity-90">
              This card uses primary colors that adjust for dark mode.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 px-6 py-3 rounded-md transition-colors">
            Primary Button
          </button>
          
          <button className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-md transition-colors ml-4">
            Secondary Button
          </button>
        </div>

        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-md">
          <p className="font-semibold">Success Message</p>
          <p className="text-sm">This shows semantic colors adapting to the theme.</p>
        </div>

        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-md">
          <p className="font-semibold">Error Message</p>
          <p className="text-sm">Error colors also adapt for better visibility.</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Form Elements
          </h3>
          <input
            type="text"
            placeholder="Text input"
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md">
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 mt-8">
          <p>Instructions for testing:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>macOS: System Settings → Appearance → Light/Dark</li>
            <li>Windows: Settings → Personalization → Colors</li>
            <li>Browser DevTools: Cmd/Ctrl+Shift+P → "Rendering" → "prefers-color-scheme"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
