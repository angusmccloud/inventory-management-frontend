/**
 * Tests: NFC URL Manager Component
 * 
 * @description Unit tests for NFC URL management UI
 * Tests generate, copy, rotate functionality and admin access
 * 
 * @see specs/006-api-integration/tasks.md - T050
 */

import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import NFCUrlManager from '../../../components/inventory/NFCUrlManager';
import { nfcUrlsApi } from '../../../lib/api/nfcUrls';
import type { NFCUrl } from '../../../types/entities';

// Mock the API client
jest.mock('../../../lib/api/nfcUrls');

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('NFCUrlManager Component', () => {
  const mockProps = {
    itemId: 'FAMILY#fam123#ITEM#item456',
    itemName: 'Milk',
  };

  const mockUrl: NFCUrl = {
    urlId: '2gSZw8ZQPb7D5kN3X8mQ78',
    itemId: 'FAMILY#fam123#ITEM#item456',
    familyId: 'fam123',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    accessCount: 5,
    lastAccessedAt: '2024-01-16T14:30:00Z',
    itemName: 'Milk',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (nfcUrlsApi.getFullUrl as jest.Mock).mockImplementation(
      (urlId: string) => `https://inventoryhq.io/t/${urlId}`
    );
  });

  describe('Initial Render', () => {
    it('should display loading state initially', () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<NFCUrlManager {...mockProps} />);

      expect(screen.getByText('Loading NFC URLs...')).toBeInTheDocument();
    });

    it('should load and display NFC URLs', async () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [mockUrl],
      });

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('NFC URLs')).toBeInTheDocument();
      });

      expect(screen.getByText(/Manage scannable URLs for Milk/)).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('5 accesses')).toBeInTheDocument();
    });

    it('should display empty state when no URLs exist', async () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [],
      });

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('No NFC URLs')).toBeInTheDocument();
      });

      expect(
        screen.getByText(/Generate your first NFC URL/)
      ).toBeInTheDocument();
    });

    it('should display error message on load failure', async () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });
  });

  describe('Generate NFC URL (T044)', () => {
    it('should generate new NFC URL', async () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [],
      });

      const newUrl: NFCUrl = {
        ...mockUrl,
        urlId: '3hTAx9AQRc8E6lO4Y9nR89',
        createdAt: '2024-01-17T10:00:00Z',
        accessCount: 0,
        lastAccessedAt: undefined,
      };

      (nfcUrlsApi.create as jest.Mock).mockResolvedValue({
        nfcUrl: newUrl,
      });

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('No NFC URLs')).toBeInTheDocument();
      });

      const generateButton = screen.getByRole('button', {
        name: /generate new nfc url/i,
      });

      fireEvent.click(generateButton);

      // Should show generating state
      await waitFor(() => {
        expect(screen.getByText('Generating...')).toBeInTheDocument();
      });

      // Should display new URL
      await waitFor(() => {
        expect(
          screen.getByText('https://inventoryhq.io/t/3hTAx9AQRc8E6lO4Y9nR89')
        ).toBeInTheDocument();
      });

      expect(nfcUrlsApi.create).toHaveBeenCalledWith(mockProps.itemId);
    });

    it('should disable generate button while generating', async () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [],
      });

      (nfcUrlsApi.create as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('No NFC URLs')).toBeInTheDocument();
      });

      const generateButton = screen.getByRole('button', {
        name: /generate new nfc url/i,
      });

      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(generateButton).toBeDisabled();
      });
    });

    it('should show error if generate fails', async () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [],
      });

      (nfcUrlsApi.create as jest.Mock).mockRejectedValue(
        new Error('Failed to generate NFC URL')
      );

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('No NFC URLs')).toBeInTheDocument();
      });

      const generateButton = screen.getByRole('button', {
        name: /generate new nfc url/i,
      });

      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(
          screen.getByText('Failed to generate NFC URL')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Copy to Clipboard (T045)', () => {
    it('should copy URL to clipboard', async () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [mockUrl],
      });

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('Active')).toBeInTheDocument();
      });

      const copyButton = screen.getByRole('button', {
        name: /copy url to clipboard/i,
      });

      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          'https://inventoryhq.io/t/2gSZw8ZQPb7D5kN3X8mQ78'
        );
      });

      // Should show "Copied!" feedback
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });

    it('should clear copied state after 2 seconds', async () => {
      jest.useFakeTimers();

      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [mockUrl],
      });

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('Active')).toBeInTheDocument();
      });

      const copyButton = screen.getByRole('button', {
        name: /copy url to clipboard/i,
      });

      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });

      // Fast-forward 2 seconds
      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
        expect(screen.getByText('Copy')).toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it('should show error if clipboard copy fails', async () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [mockUrl],
      });

      (navigator.clipboard.writeText as jest.Mock).mockRejectedValue(
        new Error('Clipboard access denied')
      );

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('Active')).toBeInTheDocument();
      });

      const copyButton = screen.getByRole('button', {
        name: /copy url to clipboard/i,
      });

      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(
          screen.getByText('Failed to copy URL to clipboard')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Rotate URL (T046)', () => {
    it('should show confirmation dialog before rotating', async () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [mockUrl],
      });

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('Active')).toBeInTheDocument();
      });

      const rotateButton = screen.getByRole('button', {
        name: /rotate url/i,
      });

      fireEvent.click(rotateButton);

      await waitFor(() => {
        expect(screen.getByText('Rotate NFC URL?')).toBeInTheDocument();
      });

      expect(
        screen.getByText(/This will deactivate the current URL/)
      ).toBeInTheDocument();
    });

    it('should cancel rotation when clicking Cancel', async () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [mockUrl],
      });

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('Active')).toBeInTheDocument();
      });

      const rotateButton = screen.getByRole('button', {
        name: /rotate url/i,
      });

      fireEvent.click(rotateButton);

      await waitFor(() => {
        expect(screen.getByText('Rotate NFC URL?')).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText('Rotate NFC URL?')).not.toBeInTheDocument();
      });

      expect(nfcUrlsApi.rotate).not.toHaveBeenCalled();
    });

    it('should rotate URL when confirmed', async () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [mockUrl],
      });

      const newUrl: NFCUrl = {
        ...mockUrl,
        urlId: '3hTAx9AQRc8E6lO4Y9nR89',
        createdAt: '2024-01-17T10:00:00Z',
        accessCount: 0,
        lastAccessedAt: undefined,
      };

      (nfcUrlsApi.rotate as jest.Mock).mockResolvedValue({
        oldUrl: { ...mockUrl, isActive: false },
        newUrl,
      });

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('Active')).toBeInTheDocument();
      });

      const rotateButton = screen.getByRole('button', {
        name: /rotate url/i,
      });

      fireEvent.click(rotateButton);

      await waitFor(() => {
        expect(screen.getByText('Rotate NFC URL?')).toBeInTheDocument();
      });

      const dialog = screen.getByRole('dialog');
      const confirmButton = within(dialog).getByRole('button', {
        name: /rotate url/i,
      });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(nfcUrlsApi.rotate).toHaveBeenCalledWith(
          mockProps.itemId,
          mockUrl.urlId
        );
      });

      // Should show new URL
      await waitFor(() => {
        expect(
          screen.getByText('https://inventoryhq.io/t/3hTAx9AQRc8E6lO4Y9nR89')
        ).toBeInTheDocument();
      });

      // Should show both active and inactive URLs
      const badges = screen.getAllByText(/Active|Inactive/);
      expect(badges).toHaveLength(2);
    });

    it('should show error if rotation fails', async () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [mockUrl],
      });

      (nfcUrlsApi.rotate as jest.Mock).mockRejectedValue(
        new Error('Failed to rotate NFC URL')
      );

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('Active')).toBeInTheDocument();
      });

      const rotateButton = screen.getByRole('button', {
        name: /rotate url/i,
      });

      fireEvent.click(rotateButton);

      await waitFor(() => {
        expect(screen.getByText('Rotate NFC URL?')).toBeInTheDocument();
      });

      const dialog = screen.getByRole('dialog');
      const confirmButton = within(dialog).getByRole('button', {
        name: /rotate url/i,
      });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(
          screen.getByText('Failed to rotate NFC URL')
        ).toBeInTheDocument();
      });
    });

    it('should only show rotate button for active URLs', async () => {
      const inactiveUrl: NFCUrl = {
        ...mockUrl,
        isActive: false,
      };

      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [mockUrl, inactiveUrl],
      });

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        const badges = screen.getAllByText(/Active|Inactive/);
        expect(badges).toHaveLength(2);
      });

      // Should only have one rotate button (for active URL)
      const rotateButtons = screen.getAllByRole('button', {
        name: /rotate url/i,
      });
      expect(rotateButtons).toHaveLength(1);
    });
  });

  describe('URL Display (T047)', () => {
    it('should display full URL format', async () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [mockUrl],
      });

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(
          screen.getByText('https://inventoryhq.io/t/2gSZw8ZQPb7D5kN3X8mQ78')
        ).toBeInTheDocument();
      });
    });

    it('should display access count', async () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [mockUrl],
      });

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('5 accesses')).toBeInTheDocument();
      });
    });

    it('should display singular "access" for count of 1', async () => {
      const urlWithOneAccess: NFCUrl = {
        ...mockUrl,
        accessCount: 1,
      };

      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [urlWithOneAccess],
      });

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('1 access')).toBeInTheDocument();
      });
    });

    it('should display created and last accessed dates', async () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [mockUrl],
      });

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText(/Created:/)).toBeInTheDocument();
        expect(screen.getByText(/Last accessed:/)).toBeInTheDocument();
      });
    });

    it('should not show last accessed if never accessed', async () => {
      const neverAccessedUrl: NFCUrl = {
        ...mockUrl,
        accessCount: 0,
        lastAccessedAt: undefined,
      };

      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [neverAccessedUrl],
      });

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText(/Created:/)).toBeInTheDocument();
      });

      expect(screen.queryByText(/Last accessed:/)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [mockUrl],
      });

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('Active')).toBeInTheDocument();
      });

      expect(
        screen.getByRole('button', { name: /generate new nfc url/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /copy url to clipboard/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /rotate url/i })
      ).toBeInTheDocument();
    });

    it('should have modal dialog with proper roles', async () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockResolvedValue({
        nfcUrls: [mockUrl],
      });

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('Active')).toBeInTheDocument();
      });

      const rotateButton = screen.getByRole('button', {
        name: /rotate url/i,
      });

      fireEvent.click(rotateButton);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute('aria-labelledby', 'rotate-dialog-title');
      });
    });

    it('should have error alert with proper role', async () => {
      (nfcUrlsApi.listForItem as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      render(<NFCUrlManager {...mockProps} />);

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });
  });
});
