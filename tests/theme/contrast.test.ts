/**
 * Accessibility Contrast Tests for Theme Color System
 * Feature: 009-theme-color-update
 * 
 * Validates WCAG AA compliance for all theme color combinations.
 * Requirements:
 * - Normal text: 4.5:1 contrast ratio
 * - Large text (18pt+ or 14pt+ bold): 3:1 contrast ratio
 * - UI components: 3:1 contrast ratio
 */

/**
 * Calculate relative luminance of an RGB color
 * Based on WCAG 2.1 specification
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two RGB colors
 * Returns value between 1:1 and 21:1
 */
function getContrastRatio(color1: [number, number, number], color2: [number, number, number]): number {
  const lum1 = getLuminance(...color1);
  const lum2 = getLuminance(...color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Theme color definitions from globals.css
 */
const themeColors = {
  light: {
    background: [140, 197, 154] as [number, number, number], // #8CC59A
    textDefault: [10, 51, 21] as [number, number, number],    // #0A3315
    primary: [10, 51, 21] as [number, number, number],        // #0A3315
    primaryContrast: [140, 197, 154] as [number, number, number], // #8CC59A
    secondary: [9, 36, 42] as [number, number, number],       // #09242A
    secondaryContrast: [214, 230, 233] as [number, number, number], // #D6E6E9
    tertiary: [68, 41, 13] as [number, number, number],       // #44290D
    tertiaryContrast: [187, 214, 242] as [number, number, number], // #BBD6F2
    error: [68, 20, 13] as [number, number, number],          // #44140D
    errorContrast: [187, 210, 231] as [number, number, number], // #BBD2E7
    surface: [255, 255, 255] as [number, number, number],     // #FFFFFF
  },
  dark: {
    background: [10, 51, 21] as [number, number, number],     // #0A3315
    textDefault: [140, 197, 154] as [number, number, number], // #8CC59A
    primary: [140, 197, 154] as [number, number, number],     // #8CC59A
    primaryContrast: [10, 51, 21] as [number, number, number], // #0A3315
    secondary: [214, 230, 233] as [number, number, number],   // #D6E6E9
    secondaryContrast: [9, 36, 42] as [number, number, number], // #09242A
    tertiary: [187, 214, 242] as [number, number, number],    // #BBD6F2
    tertiaryContrast: [68, 41, 13] as [number, number, number], // #44290D
    error: [187, 210, 231] as [number, number, number],       // #BBD2E7
    errorContrast: [68, 20, 13] as [number, number, number],  // #44140D
    surface: [30, 41, 59] as [number, number, number],        // #1E293B
  },
};

describe('Theme Color Contrast (WCAG AA Compliance)', () => {
  describe('Light Mode', () => {
    describe('Text on Background', () => {
      it('text-default on background should meet 4.5:1 for normal text', () => {
        const ratio = getContrastRatio(themeColors.light.textDefault, themeColors.light.background);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('primary on background should meet 4.5:1 for normal text', () => {
        const ratio = getContrastRatio(themeColors.light.primary, themeColors.light.background);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('secondary on background should meet 4.5:1 for normal text', () => {
        const ratio = getContrastRatio(themeColors.light.secondary, themeColors.light.background);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('tertiary on background should meet 4.5:1 for normal text', () => {
        const ratio = getContrastRatio(themeColors.light.tertiary, themeColors.light.background);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('error on background should meet 4.5:1 for normal text', () => {
        const ratio = getContrastRatio(themeColors.light.error, themeColors.light.background);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });
    });

    describe('Contrast Pairs', () => {
      it('primary-contrast on primary should meet 4.5:1', () => {
        const ratio = getContrastRatio(themeColors.light.primaryContrast, themeColors.light.primary);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('secondary-contrast on secondary should meet 4.5:1', () => {
        const ratio = getContrastRatio(themeColors.light.secondaryContrast, themeColors.light.secondary);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('tertiary-contrast on tertiary should meet 4.5:1', () => {
        const ratio = getContrastRatio(themeColors.light.tertiaryContrast, themeColors.light.tertiary);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('error-contrast on error should meet 4.5:1', () => {
        const ratio = getContrastRatio(themeColors.light.errorContrast, themeColors.light.error);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });
    });

    describe('Text on Surface', () => {
      it('text-default on surface should meet 4.5:1', () => {
        const ratio = getContrastRatio(themeColors.light.textDefault, themeColors.light.surface);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('primary on surface should meet 4.5:1', () => {
        const ratio = getContrastRatio(themeColors.light.primary, themeColors.light.surface);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });
    });
  });

  describe('Dark Mode', () => {
    describe('Text on Background', () => {
      it('text-default on background should meet 4.5:1 for normal text', () => {
        const ratio = getContrastRatio(themeColors.dark.textDefault, themeColors.dark.background);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('primary on background should meet 4.5:1 for normal text', () => {
        const ratio = getContrastRatio(themeColors.dark.primary, themeColors.dark.background);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('secondary on background should meet 4.5:1 for normal text', () => {
        const ratio = getContrastRatio(themeColors.dark.secondary, themeColors.dark.background);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('tertiary on background should meet 4.5:1 for normal text', () => {
        const ratio = getContrastRatio(themeColors.dark.tertiary, themeColors.dark.background);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('error on background should meet 4.5:1 for normal text', () => {
        const ratio = getContrastRatio(themeColors.dark.error, themeColors.dark.background);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });
    });

    describe('Contrast Pairs', () => {
      it('primary-contrast on primary should meet 4.5:1', () => {
        const ratio = getContrastRatio(themeColors.dark.primaryContrast, themeColors.dark.primary);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('secondary-contrast on secondary should meet 4.5:1', () => {
        const ratio = getContrastRatio(themeColors.dark.secondaryContrast, themeColors.dark.secondary);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('tertiary-contrast on tertiary should meet 4.5:1', () => {
        const ratio = getContrastRatio(themeColors.dark.tertiaryContrast, themeColors.dark.tertiary);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('error-contrast on error should meet 4.5:1', () => {
        const ratio = getContrastRatio(themeColors.dark.errorContrast, themeColors.dark.error);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });
    });

    describe('Text on Surface', () => {
      it('text-default on surface should meet 4.5:1', () => {
        const ratio = getContrastRatio(themeColors.dark.textDefault, themeColors.dark.surface);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });

      it('primary on surface should meet 4.5:1', () => {
        const ratio = getContrastRatio(themeColors.dark.primary, themeColors.dark.surface);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      });
    });
  });
});
