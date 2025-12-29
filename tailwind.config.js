/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media', // Use media query for automatic system preference detection
  theme: {
    extend: {
      colors: {
        // Primary colors - main brand color
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          contrast: 'rgb(var(--color-primary-contrast) / <alpha-value>)',
          hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
        },
        // Secondary colors - accent color
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
          contrast: 'rgb(var(--color-secondary-contrast) / <alpha-value>)',
          hover: 'rgb(var(--color-secondary-hover) / <alpha-value>)',
        },
        // Tertiary colors - supplementary color
        tertiary: {
          DEFAULT: 'rgb(var(--color-tertiary) / <alpha-value>)',
          contrast: 'rgb(var(--color-tertiary-contrast) / <alpha-value>)',
        },
        // Surface colors - backgrounds for cards, panels, etc.
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          elevated: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
          hover: 'rgb(var(--color-surface-hover) / <alpha-value>)',
        },
        // Background color - main page background
        background: 'rgb(var(--color-background) / <alpha-value>)',
        // Text colors
        text: {
          default: 'rgb(var(--color-text-default) / <alpha-value>)',
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          disabled: 'rgb(var(--color-text-disabled) / <alpha-value>)',
        },
        // Border colors
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          focus: 'rgb(var(--color-border-focus) / <alpha-value>)',
        },
        // Semantic colors
        success: {
          DEFAULT: 'rgb(var(--color-success) / <alpha-value>)',
          contrast: 'rgb(var(--color-success-contrast) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--color-warning) / <alpha-value>)',
          contrast: 'rgb(var(--color-warning-contrast) / <alpha-value>)',
        },
        error: {
          DEFAULT: 'rgb(var(--color-error) / <alpha-value>)',
          contrast: 'rgb(var(--color-error-contrast) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'rgb(var(--color-info) / <alpha-value>)',
          contrast: 'rgb(var(--color-info-contrast) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
