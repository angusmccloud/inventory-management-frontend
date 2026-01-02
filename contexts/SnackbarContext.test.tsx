/**
 * Snackbar Context Tests
 * 
 * Tests for the global snackbar notification system.
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SnackbarProvider, useSnackbar } from './SnackbarContext';

// Test component that uses the snackbar
const TestComponent: React.FC = () => {
  const { showSnackbar, hideSnackbar } = useSnackbar();
  
  return (
    <div>
      <button
        onClick={() => showSnackbar({ variant: 'info', text: 'Info message' })}
        data-testid="show-info"
      >
        Show Info
      </button>
      <button
        onClick={() => showSnackbar({ variant: 'success', text: 'Success message' })}
        data-testid="show-success"
      >
        Show Success
      </button>
      <button
        onClick={() => showSnackbar({ variant: 'warning', text: 'Warning message' })}
        data-testid="show-warning"
      >
        Show Warning
      </button>
      <button
        onClick={() => showSnackbar({ variant: 'error', text: 'Error message' })}
        data-testid="show-error"
      >
        Show Error
      </button>
      <button
        onClick={() => showSnackbar({ 
          variant: 'info', 
          text: 'No auto-hide', 
          autoHide: false 
        })}
        data-testid="show-no-autohide"
      >
        Show No Auto-hide
      </button>
      <button
        onClick={() => showSnackbar({ 
          variant: 'info', 
          text: 'Custom duration', 
          autoHideDuration: 1000 
        })}
        data-testid="show-custom-duration"
      >
        Show Custom Duration
      </button>
      <button onClick={hideSnackbar} data-testid="hide-snackbar">
        Hide
      </button>
    </div>
  );
};

describe('SnackbarContext', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  
  it('throws error when useSnackbar is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useSnackbar must be used within a SnackbarProvider');
    
    consoleSpy.mockRestore();
  });
  
  it('shows info snackbar when triggered', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <SnackbarProvider>
        <TestComponent />
      </SnackbarProvider>
    );
    
    await user.click(screen.getByTestId('show-info'));
    
    await waitFor(() => {
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
  });
  
  it('shows success snackbar when triggered', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <SnackbarProvider>
        <TestComponent />
      </SnackbarProvider>
    );
    
    await user.click(screen.getByTestId('show-success'));
    
    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });
  });
  
  it('shows warning snackbar when triggered', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <SnackbarProvider>
        <TestComponent />
      </SnackbarProvider>
    );
    
    await user.click(screen.getByTestId('show-warning'));
    
    await waitFor(() => {
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });
  });
  
  it('shows error snackbar when triggered', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <SnackbarProvider>
        <TestComponent />
      </SnackbarProvider>
    );
    
    await user.click(screen.getByTestId('show-error'));
    
    await waitFor(() => {
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });
  
  it('auto-hides snackbar after default duration (5 seconds)', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <SnackbarProvider>
        <TestComponent />
      </SnackbarProvider>
    );
    
    await user.click(screen.getByTestId('show-info'));
    
    await waitFor(() => {
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
    
    // Fast-forward time by 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    await waitFor(() => {
      expect(screen.queryByText('Info message')).not.toBeInTheDocument();
    });
  });
  
  it('respects custom auto-hide duration', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <SnackbarProvider>
        <TestComponent />
      </SnackbarProvider>
    );
    
    await user.click(screen.getByTestId('show-custom-duration'));
    
    await waitFor(() => {
      expect(screen.getByText('Custom duration')).toBeInTheDocument();
    });
    
    // Fast-forward time by 1 second (custom duration)
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(screen.queryByText('Custom duration')).not.toBeInTheDocument();
    });
  });
  
  it('does not auto-hide when autoHide is false', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <SnackbarProvider>
        <TestComponent />
      </SnackbarProvider>
    );
    
    await user.click(screen.getByTestId('show-no-autohide'));
    
    await waitFor(() => {
      expect(screen.getByText('No auto-hide')).toBeInTheDocument();
    });
    
    // Fast-forward time by 10 seconds
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    
    // Should still be visible
    expect(screen.getByText('No auto-hide')).toBeInTheDocument();
  });
  
  it('hides snackbar when hideSnackbar is called', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <SnackbarProvider>
        <TestComponent />
      </SnackbarProvider>
    );
    
    await user.click(screen.getByTestId('show-info'));
    
    await waitFor(() => {
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
    
    await user.click(screen.getByTestId('hide-snackbar'));
    
    await waitFor(() => {
      expect(screen.queryByText('Info message')).not.toBeInTheDocument();
    });
  });
  
  it('replaces existing snackbar when a new one is shown', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <SnackbarProvider>
        <TestComponent />
      </SnackbarProvider>
    );
    
    await user.click(screen.getByTestId('show-info'));
    
    await waitFor(() => {
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
    
    await user.click(screen.getByTestId('show-success'));
    
    await waitFor(() => {
      expect(screen.queryByText('Info message')).not.toBeInTheDocument();
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });
  });
  
  it('clears timeout when new snackbar is shown', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <SnackbarProvider>
        <TestComponent />
      </SnackbarProvider>
    );
    
    // Show first snackbar
    await user.click(screen.getByTestId('show-info'));
    
    await waitFor(() => {
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
    
    // Advance time by 3 seconds (not enough to auto-hide)
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Show second snackbar (should clear first timeout)
    await user.click(screen.getByTestId('show-success'));
    
    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });
    
    // Advance time by 5 seconds (should hide second snackbar)
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });
  
  it('provides dismiss button that works correctly', async () => {
    const user = userEvent.setup({ delay: null });
    
    render(
      <SnackbarProvider>
        <TestComponent />
      </SnackbarProvider>
    );
    
    await user.click(screen.getByTestId('show-info'));
    
    await waitFor(() => {
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
    
    // Click the dismiss button (from Alert component)
    const dismissButton = screen.getByLabelText('Dismiss alert');
    await user.click(dismissButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Info message')).not.toBeInTheDocument();
    });
  });
});
