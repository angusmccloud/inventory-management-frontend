/**
 * Tests: NFC Adjustment Page
 * 
 * @description Unit tests for NFC adjustment server component
 * Tests successful adjustments, error handling, and accessibility
 * 
 * @see specs/006-api-integration/tasks.md - T023 (partial)
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Next.js navigation functions
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('NFC Adjustment Page', () => {
  const mockUrlId = '2gSZw8ZQPb7D5kN3X8mQ78';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('Success State', () => {
    it('should display success message with item name and new quantity', async () => {
      // Mock successful API response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          newQuantity: 9,
          itemName: 'Milk',
          message: 'Milk quantity updated to 9',
        }),
      });

      // Import the page component dynamically to trigger server-side logic
      const NfcPage = (await import('../../../app/t/[urlId]/page')).default;

      // Render with mocked params
      const { container } = render(
        await NfcPage({ params: Promise.resolve({ urlId: mockUrlId }) })
      );

      // Verify success icon is present
      const successIcon = container.querySelector('svg.text-green-600');
      expect(successIcon).toBeInTheDocument();

      // Verify item name is displayed
      expect(screen.getByText('Milk')).toBeInTheDocument();

      // Verify success message
      expect(screen.getByText('Quantity updated successfully')).toBeInTheDocument();

      // Verify current quantity display
      expect(screen.getByText('9')).toBeInTheDocument();
      expect(screen.getByText('Current Quantity')).toBeInTheDocument();

      // Verify fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        `${apiBaseUrl}/api/adjust/${mockUrlId}`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ delta: -1 }),
          cache: 'no-store',
        })
      );
    });

    it('should display quantity of 0 when item runs out', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          newQuantity: 0,
          itemName: 'Bread',
          message: 'Bread quantity updated to 0',
        }),
      });

      const NfcPage = (await import('../../../app/t/[urlId]/page')).default;
      render(await NfcPage({ params: Promise.resolve({ urlId: mockUrlId }) }));

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('Bread')).toBeInTheDocument();
    });

    it('should have accessible color contrast (WCAG 2.1 AA)', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          newQuantity: 5,
          itemName: 'Eggs',
          message: 'Eggs quantity updated to 5',
        }),
      });

      const NfcPage = (await import('../../../app/t/[urlId]/page')).default;
      const { container } = render(
        await NfcPage({ params: Promise.resolve({ urlId: mockUrlId }) })
      );

      // Verify dark mode classes are present (indicates theme support)
      const mainElement = container.querySelector('main');
      expect(mainElement).toHaveClass('dark:from-gray-900');

      // Verify text colors use appropriate contrast classes
      const itemName = screen.getByText('Eggs');
      expect(itemName).toHaveClass('text-gray-900', 'dark:text-white');
    });
  });

  describe('Error State', () => {
    it('should display error message for network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const NfcPage = (await import('../../../app/t/[urlId]/page')).default;
      const { container } = render(
        await NfcPage({ params: Promise.resolve({ urlId: mockUrlId }) })
      );

      // Verify error icon is present
      const errorIcon = container.querySelector('svg.text-red-600');
      expect(errorIcon).toBeInTheDocument();

      // Verify error message
      expect(screen.getByText('Adjustment Failed')).toBeInTheDocument();
      expect(
        screen.getByText('Network error - please try again')
      ).toBeInTheDocument();
    });

    it('should display error for non-404 API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'MIN_QUANTITY',
          code: 'MIN_QUANTITY',
        }),
      });

      const NfcPage = (await import('../../../app/t/[urlId]/page')).default;
      render(await NfcPage({ params: Promise.resolve({ urlId: mockUrlId }) }));

      expect(screen.getByText('Adjustment Failed')).toBeInTheDocument();
      expect(screen.getByText('Adjustment failed')).toBeInTheDocument();
      expect(screen.getByText('Error code: MIN_QUANTITY')).toBeInTheDocument();
    });

    it('should provide retry instructions in error state', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const NfcPage = (await import('../../../app/t/[urlId]/page')).default;
      render(await NfcPage({ params: Promise.resolve({ urlId: mockUrlId }) }));

      expect(
        screen.getByText(/Try tapping the NFC tag again/)
      ).toBeInTheDocument();
    });
  });

  describe('Not Found Handling', () => {
    it('should call notFound() for 404 responses', async () => {
      const { notFound } = await import('next/navigation');

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          error: 'NOT_FOUND',
          code: 'NOT_FOUND',
        }),
      });

      const NfcPage = (await import('../../../app/t/[urlId]/page')).default;
      await NfcPage({ params: Promise.resolve({ urlId: mockUrlId }) });

      expect(notFound).toHaveBeenCalled();
    });

    it('should call notFound() for invalid URL ID format', async () => {
      const { notFound } = await import('next/navigation');

      const NfcPage = (await import('../../../app/t/[urlId]/page')).default;
      await NfcPage({ params: Promise.resolve({ urlId: 'invalid' }) });

      expect(notFound).toHaveBeenCalled();
    });

    it('should call notFound() for URL ID that is too short', async () => {
      const { notFound } = await import('next/navigation');

      const NfcPage = (await import('../../../app/t/[urlId]/page')).default;
      await NfcPage({ params: Promise.resolve({ urlId: 'short' }) });

      expect(notFound).toHaveBeenCalled();
    });

    it('should call notFound() for URL ID with special characters', async () => {
      const { notFound } = await import('next/navigation');

      const NfcPage = (await import('../../../app/t/[urlId]/page')).default;
      await NfcPage({
        params: Promise.resolve({ urlId: '2gSZw8ZQPb7D5kN3X8mQ-!' }),
      });

      expect(notFound).toHaveBeenCalled();
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should use responsive classes for mobile layout', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          newQuantity: 7,
          itemName: 'Butter',
          message: 'Butter quantity updated to 7',
        }),
      });

      const NfcPage = (await import('../../../app/t/[urlId]/page')).default;
      const { container } = render(
        await NfcPage({ params: Promise.resolve({ urlId: mockUrlId }) })
      );

      // Verify responsive classes
      const mainElement = container.querySelector('main');
      expect(mainElement).toHaveClass('min-h-screen', 'p-4');

      // Verify max-width constraint for content
      const contentDiv = container.querySelector('.max-w-md');
      expect(contentDiv).toBeInTheDocument();
    });

    it('should set proper viewport metadata', async () => {
      const { generateMetadata } = await import('../../../app/t/[urlId]/page');
      const metadata = await generateMetadata({
        params: Promise.resolve({ urlId: mockUrlId }),
      });

      expect(metadata.viewport).toBe(
        'width=device-width, initial-scale=1, maximum-scale=1'
      );
    });
  });

  describe('Accessibility', () => {
    it('should include aria-hidden on decorative icons', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          newQuantity: 3,
          itemName: 'Cheese',
          message: 'Cheese quantity updated to 3',
        }),
      });

      const NfcPage = (await import('../../../app/t/[urlId]/page')).default;
      const { container } = render(
        await NfcPage({ params: Promise.resolve({ urlId: mockUrlId }) })
      );

      // Verify decorative SVGs have aria-hidden
      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should use semantic HTML elements', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          newQuantity: 2,
          itemName: 'Yogurt',
          message: 'Yogurt quantity updated to 2',
        }),
      });

      const NfcPage = (await import('../../../app/t/[urlId]/page')).default;
      const { container } = render(
        await NfcPage({ params: Promise.resolve({ urlId: mockUrlId }) })
      );

      // Verify main landmark
      expect(container.querySelector('main')).toBeInTheDocument();

      // Verify heading hierarchy
      expect(container.querySelector('h1')).toBeInTheDocument();

      // Verify paragraph elements
      expect(container.querySelector('p')).toBeInTheDocument();
    });

    it('should have proper heading structure', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          newQuantity: 4,
          itemName: 'Orange Juice',
          message: 'Orange Juice quantity updated to 4',
        }),
      });

      const NfcPage = (await import('../../../app/t/[urlId]/page')).default;
      render(await NfcPage({ params: Promise.resolve({ urlId: mockUrlId }) }));

      // Verify h1 exists and is the item name
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Orange Juice');
    });
  });

  describe('Cache Control', () => {
    it('should set cache: no-store for adjustment requests', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          newQuantity: 6,
          itemName: 'Apples',
          message: 'Apples quantity updated to 6',
        }),
      });

      const NfcPage = (await import('../../../app/t/[urlId]/page')).default;
      await NfcPage({ params: Promise.resolve({ urlId: mockUrlId }) });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          cache: 'no-store',
        })
      );
    });
  });
});
