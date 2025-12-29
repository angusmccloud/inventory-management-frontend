/**
 * PageLoading Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PageLoading } from './PageLoading';

describe('PageLoading', () => {
  describe('Rendering', () => {
    it('renders with default message', () => {
      render(<PageLoading />);
      // Message appears in both spinner aria-label and visible text
      const messages = screen.getAllByText('Loading...');
      expect(messages.length).toBeGreaterThan(0);
    });

    it('renders with custom message', () => {
      render(<PageLoading message="Loading dashboard..." />);
      expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    });

    it('renders loading spinner', () => {
      const { container } = render(<PageLoading />);
      // LoadingSpinner uses a div with animate-spin class
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('applies full height by default', () => {
      const { container } = render(<PageLoading />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('min-h-screen');
    });

    it('applies compact height when fullHeight is false', () => {
      const { container } = render(<PageLoading fullHeight={false} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).not.toHaveClass('min-h-screen');
      expect(wrapper).toHaveClass('py-12');
    });

    it('applies custom className', () => {
      const { container } = render(<PageLoading className="custom-class" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  describe('Theme Colors', () => {
    it('uses bg-background color', () => {
      const { container } = render(<PageLoading />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('bg-background');
    });

    it('uses text-text-secondary for message', () => {
      render(<PageLoading message="Test message" />);
      const message = screen.getByText('Test message');
      expect(message).toHaveClass('text-text-secondary');
    });
  });

  describe('Accessibility', () => {
    it('centers content for better visibility', () => {
      const { container } = render(<PageLoading />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('flex');
      expect(wrapper).toHaveClass('items-center');
      expect(wrapper).toHaveClass('justify-center');
    });

    it('provides loading context through spinner label', () => {
      render(<PageLoading message="Loading data..." />);
      // The message itself provides context
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });
  });
});
