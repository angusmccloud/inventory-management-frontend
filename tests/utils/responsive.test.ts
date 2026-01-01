/**
 * Responsive Testing Utilities - Unit Tests
 * Feature: 011-mobile-responsive-ui
 */

import {
  viewportSizes,
  touchTargetSizes,
  checkTouchTargetSize,
  mockMatchMedia,
  getResponsiveClasses,
  assertMobileFirstLayout,
  checkFlexWrap,
} from './responsive';

describe('Responsive Testing Utilities', () => {
  describe('viewportSizes', () => {
    it('should have mobile viewport presets', () => {
      expect(viewportSizes.mobile.small).toEqual({ width: 320, height: 568 });
      expect(viewportSizes.mobile.medium).toEqual({ width: 375, height: 667 });
      expect(viewportSizes.mobile.large).toEqual({ width: 414, height: 896 });
    });

    it('should have tablet viewport presets', () => {
      expect(viewportSizes.tablet.small).toEqual({ width: 640, height: 960 });
      expect(viewportSizes.tablet.medium).toEqual({ width: 768, height: 1024 });
    });

    it('should have desktop viewport presets', () => {
      expect(viewportSizes.desktop.small).toEqual({ width: 1024, height: 768 });
      expect(viewportSizes.desktop.medium).toEqual({ width: 1280, height: 800 });
      expect(viewportSizes.desktop.large).toEqual({ width: 1920, height: 1080 });
    });
  });

  describe('touchTargetSizes', () => {
    it('should have WCAG 2.1 AA minimum size', () => {
      expect(touchTargetSizes.minimum).toBe(44);
    });

    it('should have comfortable recommended size', () => {
      expect(touchTargetSizes.comfortable).toBe(48);
    });
  });

  describe('checkTouchTargetSize', () => {
    it('should pass for element meeting minimum size', () => {
      const element = document.createElement('button');
      Object.defineProperty(element, 'getBoundingClientRect', {
        value: () => ({ width: 48, height: 48 }),
      });

      const result = checkTouchTargetSize(element);
      expect(result.pass).toBe(true);
      expect(result.width).toBe(48);
      expect(result.height).toBe(48);
      expect(result.minRequired).toBe(44);
    });

    it('should fail for element below minimum width', () => {
      const element = document.createElement('button');
      Object.defineProperty(element, 'getBoundingClientRect', {
        value: () => ({ width: 32, height: 48 }),
      });

      const result = checkTouchTargetSize(element);
      expect(result.pass).toBe(false);
      expect(result.width).toBe(32);
    });

    it('should fail for element below minimum height', () => {
      const element = document.createElement('button');
      Object.defineProperty(element, 'getBoundingClientRect', {
        value: () => ({ width: 48, height: 32 }),
      });

      const result = checkTouchTargetSize(element);
      expect(result.pass).toBe(false);
      expect(result.height).toBe(32);
    });
  });

  describe('mockMatchMedia', () => {
    it('should mock mobile viewport (sm: 640px)', () => {
      mockMatchMedia('sm');

      // Should match min-width: 640px
      const mediaQuery640 = window.matchMedia('(min-width: 640px)');
      expect(mediaQuery640.matches).toBe(true);

      // Should not match min-width: 768px
      const mediaQuery768 = window.matchMedia('(min-width: 768px)');
      expect(mediaQuery768.matches).toBe(false);
    });

    it('should mock tablet viewport (md: 768px)', () => {
      mockMatchMedia('md');

      const mediaQuery768 = window.matchMedia('(min-width: 768px)');
      expect(mediaQuery768.matches).toBe(true);

      const mediaQuery1024 = window.matchMedia('(min-width: 1024px)');
      expect(mediaQuery1024.matches).toBe(false);
    });

    it('should mock desktop viewport (lg: 1024px)', () => {
      mockMatchMedia('lg');

      const mediaQuery1024 = window.matchMedia('(min-width: 1024px)');
      expect(mediaQuery1024.matches).toBe(true);
    });
  });

  describe('getResponsiveClasses', () => {
    it('should find sm: prefixed classes', () => {
      const element = document.createElement('div');
      element.className = 'flex flex-col sm:flex-row sm:gap-4';

      const responsiveClasses = getResponsiveClasses(element, 'sm');
      expect(responsiveClasses).toEqual(['sm:flex-row', 'sm:gap-4']);
    });

    it('should find md: prefixed classes', () => {
      const element = document.createElement('div');
      element.className = 'text-sm md:text-base md:px-4';

      const responsiveClasses = getResponsiveClasses(element, 'md');
      expect(responsiveClasses).toEqual(['md:text-base', 'md:px-4']);
    });

    it('should return empty array when no responsive classes found', () => {
      const element = document.createElement('div');
      element.className = 'flex flex-col gap-2';

      const responsiveClasses = getResponsiveClasses(element, 'md');
      expect(responsiveClasses).toEqual([]);
    });
  });

  describe('assertMobileFirstLayout', () => {
    it('should pass when element has correct mobile-first pattern', () => {
      const element = document.createElement('div');
      element.className = 'flex flex-col gap-2 md:flex-row md:gap-4';

      const result = assertMobileFirstLayout(element, {
        mobile: ['flex', 'flex-col'],
        desktop: ['flex-row'],
        breakpoint: 'md',
      });

      expect(result.pass).toBe(true);
    });

    it('should fail when mobile classes are missing', () => {
      const element = document.createElement('div');
      element.className = 'md:flex-row md:gap-4';

      const result = assertMobileFirstLayout(element, {
        mobile: ['flex', 'flex-col'],
        desktop: ['flex-row'],
        breakpoint: 'md',
      });

      expect(result.pass).toBe(false);
      expect(result.message).toContain('missing classes');
    });

    it('should fail when desktop classes are missing', () => {
      const element = document.createElement('div');
      element.className = 'flex flex-col';

      const result = assertMobileFirstLayout(element, {
        mobile: ['flex', 'flex-col'],
        desktop: ['flex-row'],
        breakpoint: 'md',
      });

      expect(result.pass).toBe(false);
      expect(result.message).toContain('missing classes');
    });
  });

  describe('checkFlexWrap', () => {
    it('should pass when flex-wrap is present', () => {
      const element = document.createElement('div');
      element.className = 'flex flex-wrap gap-2';

      expect(checkFlexWrap(element)).toBe(true);
    });

    it('should pass when responsive column layout is present', () => {
      const element = document.createElement('div');
      element.className = 'flex flex-col md:flex-row';

      expect(checkFlexWrap(element)).toBe(true);
    });

    it('should fail when neither flex-wrap nor responsive column layout', () => {
      const element = document.createElement('div');
      element.className = 'flex gap-2';

      expect(checkFlexWrap(element)).toBe(false);
    });
  });
});
