/**
 * Responsive Testing Utilities
 * Feature: 011-mobile-responsive-ui
 *
 * Utilities for testing responsive layouts and touch target sizes.
 */

/**
 * Viewport size presets for responsive testing
 */
export const viewportSizes = {
  mobile: {
    small: { width: 320, height: 568 }, // iPhone SE
    medium: { width: 375, height: 667 }, // iPhone 8
    large: { width: 414, height: 896 }, // iPhone 11 Pro Max
  },
  tablet: {
    small: { width: 640, height: 960 }, // sm breakpoint
    medium: { width: 768, height: 1024 }, // md breakpoint (iPad)
  },
  desktop: {
    small: { width: 1024, height: 768 }, // lg breakpoint
    medium: { width: 1280, height: 800 }, // xl breakpoint
    large: { width: 1920, height: 1080 }, // Full HD
  },
} as const;

/**
 * Touch target size constants (WCAG 2.1 AA)
 */
export const touchTargetSizes = {
  minimum: 44, // WCAG 2.1 AA minimum
  comfortable: 48, // Recommended comfortable size
} as const;

/**
 * Check if an element meets minimum touch target size requirements
 * @param element - DOM element to check
 * @returns Object with pass/fail status and actual dimensions
 */
export function checkTouchTargetSize(element: HTMLElement): {
  pass: boolean;
  width: number;
  height: number;
  minRequired: number;
} {
  const rect = element.getBoundingClientRect();
  const minRequired = touchTargetSizes.minimum;

  return {
    pass: rect.width >= minRequired && rect.height >= minRequired,
    width: rect.width,
    height: rect.height,
    minRequired,
  };
}

/**
 * Set viewport size for responsive testing
 * Note: This is a mock function for testing. Actual viewport changes
 * would need to be handled by the testing framework (e.g., Playwright)
 *
 * @param width - Viewport width in pixels
 * @param height - Viewport height in pixels
 */
export function setViewportSize(width: number, height: number): void {
  // In Jest/RTL, we mock window.matchMedia to simulate different viewports
  // This is primarily for documentation/type safety
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
}

/**
 * Mock window.matchMedia for responsive breakpoint testing
 * @param breakpoint - Tailwind breakpoint (sm, md, lg, xl, 2xl)
 * @returns MediaQueryList mock
 */
export function mockMatchMedia(breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl'): void {
  const breakpointWidths = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  };

  const width = breakpointWidths[breakpoint];

  // Mock matchMedia for different breakpoints
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => {
      // Parse media query to determine if it should match
      const minWidthMatch = query.match(/min-width:\s*(\d+)px/);
      const maxWidthMatch = query.match(/max-width:\s*(\d+)px/);

      let matches = true;
      if (minWidthMatch && minWidthMatch[1]) {
        matches = matches && width >= parseInt(minWidthMatch[1], 10);
      }
      if (maxWidthMatch && maxWidthMatch[1]) {
        matches = matches && width <= parseInt(maxWidthMatch[1], 10);
      }

      return {
        matches,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    }),
  });
}

/**
 * Check if an element uses responsive Tailwind classes
 * @param element - DOM element to check
 * @param breakpoint - Breakpoint to check (sm, md, lg)
 * @returns Array of responsive classes found
 */
export function getResponsiveClasses(
  element: HTMLElement,
  breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
): string[] {
  const classList = Array.from(element.classList);
  const prefix = `${breakpoint}:`;

  return classList.filter((className) => className.startsWith(prefix));
}

/**
 * Assert that an element has responsive classes for mobile-first design
 * @param element - DOM element to check
 * @param expectedPattern - Expected responsive pattern (e.g., 'flex-col md:flex-row')
 */
export function assertMobileFirstLayout(
  element: HTMLElement,
  expectedPattern: {
    mobile: string[];
    desktop: string[];
    breakpoint: 'sm' | 'md' | 'lg';
  }
): {
  pass: boolean;
  message: string;
} {
  const classList = Array.from(element.classList);

  // Check mobile classes (no prefix)
  const hasMobileClasses = expectedPattern.mobile.every((cls) => classList.includes(cls));

  // Check desktop classes (with breakpoint prefix)
  const hasDesktopClasses = expectedPattern.desktop.every((cls) =>
    classList.includes(`${expectedPattern.breakpoint}:${cls}`)
  );

  const pass = hasMobileClasses && hasDesktopClasses;
  const message = pass
    ? 'Element has correct mobile-first responsive classes'
    : `Element missing classes. Expected mobile: ${expectedPattern.mobile.join(', ')} and desktop: ${expectedPattern.desktop.map((c) => `${expectedPattern.breakpoint}:${c}`).join(', ')}`;

  return { pass, message };
}

/**
 * Check if flex container properly wraps on mobile
 * @param container - Flex container element
 * @returns Whether flex-wrap is applied or responsive column layout exists
 */
export function checkFlexWrap(container: HTMLElement): boolean {
  const classList = Array.from(container.classList);
  const hasFlexWrap = classList.includes('flex-wrap');
  const hasResponsiveColumn = classList.some(
    (cls) => cls === 'flex-col' || cls.match(/^(sm|md|lg):flex-row$/)
  );

  return hasFlexWrap || hasResponsiveColumn;
}
